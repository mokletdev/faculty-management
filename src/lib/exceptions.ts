import { type ZodError } from "zod";

export class ActionError extends Error {
  constructor(
    message: string,
    public readonly code:
      | "UNAUTHORIZED"
      | "VALIDATION_ERROR"
      | "CONFLICT"
      | "NOT_FOUND"
      | "FORBIDDEN"
      | "SERVER_ERROR",
    public readonly fieldErrors?: Record<string, string[]>,
  ) {
    super(message);
    this.name = "ActionError";
  }
}

export function handleActionError(error: unknown) {
  if (error instanceof ActionError) {
    return {
      error: {
        message: error.message,
        code: error.code,
        fieldErrors: error.fieldErrors,
      },
    };
  }

  // Handle Zod validation errors
  if (error instanceof Error && error.name === "ZodError") {
    const zodError = error as ZodError;
    const fieldErrors: Record<string, string[]> = {};

    zodError.errors.forEach((err) => {
      const field = err.path.join(".");
      fieldErrors[field] ??= [];
      fieldErrors[field].push(err.message);
    });

    return {
      error: {
        message: "Validasi gagal",
        code: "VALIDATION_ERROR" as const,
        fieldErrors,
      },
    };
  }

  // Handle other errors
  console.error("Server action error:", error);
  return {
    error: {
      message: "Terjadi kesalahan di server",
      code: "SERVER_ERROR" as const,
    },
  };
}
