import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama terlalu panjang"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["ADMIN", "DOSEN"]),
  image: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.string().length(0))
    .optional(),
});

export const updateUserSchema = z.object({
  name: z.string().min(1, "Nama harus diisi").max(100, "Nama terlalu panjang"),
  email: z.string().email("Email tidak valid"),
  password: z
    .string()
    .min(8, "Password minimal 8 karakter")
    .or(z.string().length(0))
    .optional(),
  role: z.enum(["ADMIN", "DOSEN"]),
  image: z
    .string()
    .url("URL gambar tidak valid")
    .or(z.string().length(0))
    .optional(),
});

export type BulkUserData = {
  name: string;
  email: string;
  password: string;
  role: "ADMIN" | "DOSEN";
  image?: string;
};

export function validateUserData(data: BulkUserData[]): {
  validData: BulkUserData[];
  errors: Record<number, string[]>;
} {
  const validData: BulkUserData[] = [];
  const errors: Record<number, string[]> = {};

  data.forEach((user, index) => {
    const rowErrors: string[] = [];

    if (!user.name) {
      rowErrors.push("Nama wajib diisi");
    }

    if (!user.email) {
      rowErrors.push("Email wajib diisi");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
      rowErrors.push("Format email tidak valid");
    }

    if (!user.password) {
      rowErrors.push("Password wajib diisi");
    } else if (user.password.length < 8) {
      rowErrors.push("Password minimal 8 karakter");
    }

    if (!user.role) {
      rowErrors.push("Role wajib diisi");
    } else if (user.role !== "ADMIN" && user.role !== "DOSEN") {
      rowErrors.push("Role harus ADMIN atau DOSEN");
    }

    if (user.image && !/^https?:\/\/.+/.test(user.image)) {
      rowErrors.push("URL gambar tidak valid");
    }

    if (rowErrors.length > 0) {
      errors[index] = rowErrors;
    } else {
      validData.push(user);
    }
  });

  return { validData, errors };
}

export const userSchema = updateUserSchema;

export type UserSchema = z.infer<typeof userSchema>;
export type CreateUserSchema = z.infer<typeof createUserSchema>;
export type UpdateUserSchema = z.infer<typeof updateUserSchema>;
