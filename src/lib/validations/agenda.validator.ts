import { Priority } from "@prisma/client";
import { z } from "zod";

export const agendaSchema = z.object({
  title: z.string().min(3, {
    message: "Judul minimal 3 karakter.",
  }),
  description: z.string().optional(),
  startTime: z.date({
    required_error: "Mohon pilih waktu mulai.",
  }),
  endTime: z.date({
    required_error: "Mohon pilih waktu selesai.",
  }),
  priority: z.nativeEnum(Priority, {
    required_error: "Mohon pilih prioritas.",
  }),
  roomId: z
    .string({
      required_error: "Mohon pilih ruangan.",
    })
    .min(1),
  accessMahasiswa: z.boolean(),
  accessAllDosen: z.boolean(),
  accessDosen: z.array(z.string()).optional(),
});

export type AgendaSchema = z.infer<typeof agendaSchema>;
