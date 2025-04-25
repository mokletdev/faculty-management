"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createRoom, updateRoom } from "@/server/actions/room.action";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the validation schema for Room
const roomSchema = z.object({
  name: z.string().min(1, { message: "Nama ruangan wajib diisi" }),
  location: z.string().optional(),
});

type RoomSchema = z.infer<typeof roomSchema>;

type RoomFormProps = {
  room?: Prisma.RoomGetPayload<{
    select: {
      id: true;
      name: true;
      location: true;
    };
  }>;
};

export const RoomForm = ({ room }: RoomFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<RoomSchema>({
    resolver: zodResolver(roomSchema),
    defaultValues: {
      name: room?.name ?? "",
      location: room?.location ?? "",
    },
  });

  async function onSubmit(values: RoomSchema) {
    try {
      setIsSubmitting(true);

      if (room) {
        const response = await updateRoom(room.id, values);

        if (response.error) {
          const { message, fieldErrors } = response.error;
          toast.error(
            message +
              `${fieldErrors ? ": " + Object.keys(fieldErrors).join(", ") : ""}`,
          );

          // Set field errors in the form
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, errors]) => {
              form.setError(field as any, {
                type: "manual",
                message: JSON.stringify(errors),
              });
            });
          }
          return;
        }
        toast.success("Ruangan berhasil diperbarui");
      } else {
        const response = await createRoom(values);

        if (response.error) {
          const { message, fieldErrors } = response.error;
          toast.error(
            message +
              `${fieldErrors ? ": " + Object.keys(fieldErrors).join(", ") : ""}`,
          );

          // Set field errors in the form
          if (fieldErrors) {
            Object.entries(fieldErrors).forEach(([field, errors]) => {
              form.setError(field as any, {
                type: "manual",
                message: JSON.stringify(errors),
              });
            });
          }
          return;
        }
        toast.success("Ruangan berhasil dibuat");
      }

      router.push("/admin/room");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-8"
      >
        <Card className="w-full max-w-2xl text-left md:min-w-2xl">
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nama Ruangan</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama ruangan"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lokasi</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan lokasi ruangan (opsional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Detail lokasi ruangan, seperti gedung atau lantai (opsional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/room")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : room
                ? "Perbarui Ruangan"
                : "Buat Ruangan"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
