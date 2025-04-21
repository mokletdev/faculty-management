import { googleCalendarClient, googleCalendarId } from "@/lib/google-calendar";
import type { Prisma, SyncStatus } from "@prisma/client";
import { db } from "../db";

type Agenda = Prisma.AgendaGetPayload<{
  include: { room: { select: { name: true; location: true } } };
}>;

// Custom error class for Google Calendar operations
export class GoogleCalendarError extends Error {
  constructor(
    message: string,
    public originalError: any,
    public operation: string,
    public agendaId: string,
  ) {
    super(message);
    this.name = "GoogleCalendarError";
  }
}

// Helper function to log sync operations
const logSync = async (
  agendaId: string,
  operation: string,
  status: string,
  message?: string,
) => {
  await db.syncLog.create({
    data: {
      agendaId,
      operation,
      status,
      message: message?.substring(0, 255),
    },
  });
};

export const createGoogleCalendarEvent = async (agenda: Agenda) => {
  try {
    // Update agenda to show sync is in progress
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        syncStatus: "PENDING" as SyncStatus,
        lastSyncAttempt: new Date(),
      },
    });

    // Create the event object
    const event = {
      summary: agenda.title,
      description: agenda.description ?? "",
      location: `Room: ${agenda.room.name}${agenda.room.location ? `, ${agenda.room.location}` : ""}`,
      start: {
        dateTime: agenda.startTime.toISOString(),
        timeZone: "Asia/Jakarta",
      },
      end: {
        dateTime: agenda.endTime.toISOString(),
        timeZone: "Asia/Jakarta",
      },
      extendedProperties: {
        private: {
          agendaId: agenda.id,
        },
      },
    };

    // Make the API call to create the event
    const response = await googleCalendarClient.events.insert({
      calendarId: googleCalendarId,
      requestBody: event,
    });

    // Update the agenda with the Google event ID and sync status
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        googleEventId: response.data.id,
        syncStatus: "SYNCED" as SyncStatus,
        syncError: null,
      },
    });

    // Log the successful operation
    await logSync(agenda.id, "create", "SUCCESS");

    return response.data.id;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ?? error.message ?? "Unknown error";
    console.error(
      `Failed to create Google Calendar event for agenda ${agenda.id}: ${errorMessage}`,
      {
        agendaId: agenda.id,
        error,
      },
    );

    // Determine the appropriate sync status based on the error
    let syncStatus: SyncStatus = "FAILED";
    if (error.response?.status === 401 || error.response?.status === 403) {
      syncStatus = "AUTH_ERROR";
    } else if (error.response?.status === 429) {
      syncStatus = "RATE_LIMITED";
    }

    // Update the agenda with the error information
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        syncStatus,
        syncError: errorMessage.substring(0, 255),
        lastSyncAttempt: new Date(),
      },
    });

    // Log the failed operation
    await logSync(agenda.id, "create", "FAILED", errorMessage as string);

    throw new GoogleCalendarError(
      `Failed to create Google Calendar event: ${errorMessage}`,
      error,
      "create",
      agenda.id,
    );
  }
};

export const updateGoogleCalendarEvent = async (agenda: Agenda) => {
  try {
    // Update agenda to show sync is in progress
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        syncStatus: "PENDING" as SyncStatus,
        lastSyncAttempt: new Date(),
      },
    });

    // If no Google event ID, create a new event instead
    if (!agenda.googleEventId) {
      await logSync(
        agenda.id,
        "update",
        "REDIRECTED_TO_CREATE",
        "No Google event ID found",
      );
      return await createGoogleCalendarEvent(agenda);
    }

    // Create the event object for update
    const event = {
      summary: agenda.title,
      description: agenda.description ?? "",
      location: `Room: ${agenda.room.name}${agenda.room.location ? `, ${agenda.room.location}` : ""}`,
      start: {
        dateTime: agenda.startTime.toISOString(),
        timeZone: "Asia/Jakarta",
      },
      end: {
        dateTime: agenda.endTime.toISOString(),
        timeZone: "Asia/Jakarta",
      },
      extendedProperties: {
        private: {
          agendaId: agenda.id,
        },
      },
    };

    // Make the API call to update the event
    await googleCalendarClient.events.update({
      calendarId: googleCalendarId,
      eventId: agenda.googleEventId,
      requestBody: event,
    });

    // Update the agenda with successful sync status
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        syncStatus: "SYNCED" as SyncStatus,
        syncError: null,
      },
    });

    // Log the successful operation
    await logSync(agenda.id, "update", "SUCCESS");

    return agenda.googleEventId;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ?? error.message ?? "Unknown error";
    console.error(
      `Failed to update Google Calendar event for agenda ${agenda.id}: ${errorMessage}`,
      {
        agendaId: agenda.id,
        googleEventId: agenda.googleEventId,
        error,
      },
    );

    // Handle 404 Not Found - event might have been deleted from Google Calendar
    if (error.response?.status === 404) {
      await logSync(
        agenda.id,
        "update",
        "NOT_FOUND",
        "Event not found in Google Calendar, creating new event",
      );

      try {
        // Clear the Google event ID since it no longer exists
        await db.agenda.update({
          where: { id: agenda.id },
          data: { googleEventId: null },
        });

        // Create a new event
        return await createGoogleCalendarEvent(agenda);
      } catch (createError) {
        await logSync(
          agenda.id,
          "update-recreate",
          "FAILED",
          (createError as { message: string }).message,
        );

        throw new GoogleCalendarError(
          `Failed to recreate Google Calendar event after 404: ${(createError as any).message}`,
          createError,
          "update-recreate",
          agenda.id,
        );
      }
    }

    // Determine the appropriate sync status based on the error
    let syncStatus: SyncStatus = "FAILED";
    if (error.response?.status === 401 || error.response?.status === 403) {
      syncStatus = "AUTH_ERROR";
    } else if (error.response?.status === 429) {
      syncStatus = "RATE_LIMITED";
    }

    // Update the agenda with the error information
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        syncStatus,
        syncError: errorMessage.substring(0, 255),
        lastSyncAttempt: new Date(),
      },
    });

    // Log the failed operation
    await logSync(agenda.id, "update", "FAILED", errorMessage as string);

    throw new GoogleCalendarError(
      `Failed to update Google Calendar event: ${errorMessage}`,
      error,
      "update",
      agenda.id,
    );
  }
};

export const deleteGoogleCalendarEvent = async (agenda: Agenda) => {
  try {
    // If no Google event ID, nothing to delete
    if (!agenda.googleEventId) {
      await logSync(agenda.id, "delete", "SKIPPED", "No Google event ID found");
      return;
    }

    // Update agenda to show sync is in progress
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        syncStatus: "PENDING" as SyncStatus,
        lastSyncAttempt: new Date(),
      },
    });

    // Make the API call to delete the event
    await googleCalendarClient.events.delete({
      calendarId: googleCalendarId,
      eventId: agenda.googleEventId,
    });

    // Update the database to reflect deletion
    await db.agenda.update({
      where: { id: agenda.id },
      data: {
        googleEventId: null,
        syncStatus: "DELETED" as SyncStatus,
        syncError: null,
      },
    });

    // Log the successful operation
    await logSync(agenda.id, "delete", "SUCCESS");
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.error?.message ?? error.message ?? "Unknown error";
    console.error(
      `Failed to delete Google Calendar event for agenda ${agenda.id}: ${errorMessage}`,
      {
        agendaId: agenda.id,
        googleEventId: agenda.googleEventId,
        error,
      },
    );

    // If event not found, consider it already deleted
    if (error.response?.status === 404) {
      await logSync(
        agenda.id,
        "delete",
        "NOT_FOUND",
        "Event already deleted from Google Calendar",
      );

      try {
        await db.agenda.update({
          where: { id: agenda.id },
          data: {
            googleEventId: null,
            syncStatus: "DELETED" as SyncStatus,
            syncError: null,
          },
        });
        return; // Successfully "deleted" (it was already gone)
      } catch (dbError) {
        console.error("Failed to update agenda after 404 in delete:", dbError);
        await logSync(
          agenda.id,
          "delete-db-update",
          "FAILED",
          (dbError as { message: string }).message,
        );
      }
    } else {
      // Update the agenda with DELETE_FAILED status
      try {
        await db.agenda.update({
          where: { id: agenda.id },
          data: {
            syncStatus: "DELETE_FAILED" as SyncStatus,
            syncError: errorMessage.substring(0, 255),
            lastSyncAttempt: new Date(),
          },
        });
      } catch (dbError) {
        console.error(
          "Failed to update agenda with delete error information:",
          dbError,
        );
        await logSync(
          agenda.id,
          "delete-db-update",
          "FAILED",
          (dbError as { message: string }).message,
        );
      }

      // Log the failed operation
      await logSync(agenda.id, "delete", "FAILED", errorMessage as string);

      throw new GoogleCalendarError(
        `Failed to delete Google Calendar event: ${errorMessage}`,
        error,
        "delete",
        agenda.id,
      );
    }
  }
};

export const retrySyncFailures = async (limit = 10): Promise<number> => {
  // Get agendas with failed sync status, oldest attempts first
  const failedAgendas = await db.agenda.findMany({
    where: {
      syncStatus: {
        in: [
          "FAILED",
          "AUTH_ERROR",
          "RATE_LIMITED",
          "DELETE_FAILED",
        ] as SyncStatus[],
      },
    },
    orderBy: {
      lastSyncAttempt: "asc",
    },
    take: limit,
    include: {
      room: {
        select: {
          name: true,
          location: true,
        },
      },
    },
  });

  let successCount = 0;

  for (const agenda of failedAgendas) {
    try {
      if (agenda.syncStatus === ("DELETE_FAILED" as SyncStatus)) {
        // Try deleting again
        await deleteGoogleCalendarEvent(agenda);
      } else {
        // Try updating/creating
        await updateGoogleCalendarEvent(agenda);
      }
      successCount++;
    } catch (error: any) {
      console.error(`Retry failed for agenda ${agenda.id}:`, error.message);
      await logSync(
        agenda.id,
        "retry",
        "FAILED",
        (error as { message: string }).message,
      );
    }
  }

  return successCount;
};

// Helper function to retry operations with exponential backoff
export const withRetry = async <T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  initialDelay = 1000,
): Promise<T> => {
  let retries = 0;

  while (true) {
    try {
      return await operation();
    } catch (error: any) {
      if (
        retries >= maxRetries ||
        !(error.response?.status === 429 || error.response?.status >= 500)
      ) {
        throw error;
      }

      retries++;
      const delay = initialDelay * Math.pow(2, retries - 1);
      console.log(
        `Retrying operation after ${delay}ms (attempt ${retries} of ${maxRetries})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};
