import type { User } from "@prisma/client";
import { db } from "../db";
import type { admin_directory_v1 } from "googleapis";
import { googleAdminDirectory } from "@/lib/googleapis";
import { getGoogleGroup } from "../retrievers/groups";

export class GoogleGroupError extends Error {
  constructor(
    message: string,
    public originalError: any,
    public operation: string,
    public userId?: string,
    public userEmail?: string,
  ) {
    super(message);
    this.name = "GoogleGroupError";
  }
}

const logGroupOperation = async (
  userId: string,
  operation: string,
  status: string,
  message?: string,
) => {
  await db.syncLog.create({
    data: {
      agendaId: userId,
      operation,
      status,
      message: message?.substring(0, 255),
    },
  });
};

export const addUserToGoogleGroup = async (user: User) => {
  if (!user.email) {
    throw new GoogleGroupError(
      "User has no email",
      null,
      "add-to-group",
      user.id,
      undefined,
    );
  }

  try {
    const { groupEmail } = await getGoogleGroup();

    const member: admin_directory_v1.Schema$Member = {
      email: user.email,
      role: "MEMBER",
    };

    await googleAdminDirectory.members.insert({
      groupKey: groupEmail,
      requestBody: member,
    });

    await logGroupOperation(user.id, user.email, "add-to-group", "SUCCESS");

    return true;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ?? error.message ?? "Unknown error";
    console.error(
      `Failed to add user ${user.email} to Google Group: ${errorMessage}`,
      {
        userId: user.id,
        userEmail: user.email,
        error,
      },
    );

    await logGroupOperation(
      user.id,
      "add-to-group",
      "FAILED",
      errorMessage as string,
    );

    throw new GoogleGroupError(
      `Failed to add user to Google Group: ${errorMessage}`,
      error,
      "add-to-group",
      user.id,
      user.email || undefined,
    );
  }
};

export const removeUserFromGoogleGroup = async (user: User) => {
  if (!user.email) {
    throw new GoogleGroupError(
      "User has no email",
      null,
      "remove-from-group",
      user.id,
      undefined,
    );
  }

  try {
    const { groupEmail } = await getGoogleGroup();

    await googleAdminDirectory.members.delete({
      groupKey: groupEmail,
      memberKey: user.email,
    });

    await logGroupOperation(
      user.id,
      user.email,
      "remove-from-group",
      "SUCCESS",
    );

    return true;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ?? error.message ?? "Unknown error";

    // If member not found, consider it already removed
    if (error.response?.status === 404) {
      await logGroupOperation(
        user.id,
        "remove-from-group",
        "NOT_FOUND",
        "Member already removed from Google Group",
      );
      return true;
    }

    console.error(
      `Failed to remove user ${user.email} from Google Group: ${errorMessage}`,
      {
        userId: user.id,
        userEmail: user.email,
        error,
      },
    );

    await logGroupOperation(
      user.id,
      "remove-from-group",
      "FAILED",
      errorMessage as string,
    );

    throw new GoogleGroupError(
      `Failed to remove user from Google Group: ${errorMessage}`,
      error,
      "remove-from-group",
      user.id,
      user.email || undefined,
    );
  }
};

export const isUserInGoogleGroup = async (
  userEmail: string,
): Promise<boolean> => {
  try {
    const { groupEmail } = await getGoogleGroup();

    const response = await googleAdminDirectory.members.get({
      groupKey: groupEmail,
      memberKey: userEmail,
    });

    return response.status === 200;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return false;
    }
    throw new GoogleGroupError(
      `Failed to check user membership: ${error.message}`,
      error,
      "check-membership",
      undefined,
      userEmail,
    );
  }
};

export const batchAddUsersToGoogleGroup = async (
  users: User[],
): Promise<{
  successCount: number;
  failedUsers: { id: string; email: string | null; error: string }[];
}> => {
  let successCount = 0;
  const failedUsers: { id: string; email: string | null; error: string }[] = [];
  const { groupEmail } = await getGoogleGroup();

  // Process users in batches to avoid rate limits
  const batchSize = 20;
  const batches = [];

  for (let i = 0; i < users.length; i += batchSize) {
    batches.push(users.slice(i, i + batchSize));
  }

  for (const batch of batches) {
    const validUsers = batch.filter((user) => user.email);

    // Skip empty batch
    if (validUsers.length === 0) continue;

    try {
      // Create batch request
      const batchRequests = validUsers.map((user) => ({
        requestBody: {
          email: user.email,
          role: "MEMBER",
        },
        groupKey: groupEmail,
      }));

      // Process batch with some delay between requests to avoid rate limits
      for (const request of batchRequests) {
        try {
          await googleAdminDirectory.members.insert(request);

          const user = validUsers.find(
            (u) => u.email === request.requestBody.email,
          );
          if (user) {
            await logGroupOperation(
              user.id,
              user.email || "unknown",
              "batch-add-to-group",
              "SUCCESS",
            );
            successCount++;
          }

          // Small delay to avoid rate limits
          await new Promise((resolve) => setTimeout(resolve, 100));
        } catch (error: any) {
          const user = validUsers.find(
            (u) => u.email === request.requestBody.email,
          );
          if (!user) continue;

          const errorMessage =
            error.response?.data?.error?.message ??
            error.message ??
            "Unknown error";

          // If already a member, count as success
          if (error.response?.data?.error?.code === 409) {
            await logGroupOperation(
              user.id,
              "batch-add-to-group",
              "ALREADY_EXISTS",
              "User is already a member",
            );
            successCount++;
            continue;
          }

          await logGroupOperation(
            user.id,
            "batch-add-to-group",
            "FAILED",
            errorMessage,
          );

          failedUsers.push({
            id: user.id,
            email: user.email,
            error: errorMessage,
          });
        }
      }
    } catch (error: any) {
      // Handle batch-level errors
      console.error("Batch processing error:", error);

      // Mark all users in this batch as failed
      for (const user of validUsers) {
        failedUsers.push({
          id: user.id,
          email: user.email,
          error: error.message ?? "Batch processing error",
        });

        await logGroupOperation(
          user.id,
          "batch-add-to-group",
          "FAILED",
          error.message ?? "Batch processing error",
        );
      }
    }

    // Wait between batches to avoid rate limits
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return { successCount, failedUsers };
};

export const retryFailedGroupInvites = async (limit = 10): Promise<number> => {
  const failedInvites = await db.syncLog.findMany({
    where: {
      operation: { in: ["add-to-group", "batch-add-to-group"] },
      status: "FAILED",
    },
    orderBy: {
      timestamp: "asc",
    },
    take: limit,
  });

  let successCount = 0;

  for (const invite of failedInvites) {
    try {
      // Get the user using the agendaId field (which stores the userId in this case)
      const user = await db.user.findUnique({
        where: { id: invite.agendaId },
      });

      if (!user || !user.email) {
        console.log(`User not found or has no email: ${invite.agendaId}`);
        continue;
      }

      // Try adding the user again
      await addUserToGoogleGroup(user);
      successCount++;
    } catch (error: any) {
      console.error(`Retry failed for user ${invite.agendaId}:`, error.message);
      await logGroupOperation(
        invite.agendaId,
        "retry-add-to-group",
        "FAILED",
        error.message,
      );
    }
  }

  return successCount;
};
