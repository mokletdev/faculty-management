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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  createUserSchema,
  updateUserSchema,
  type CreateUserSchema,
  type UpdateUserSchema,
} from "@/lib/validations/user";
import { createUser, updateUser } from "@/server/actions/user";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma, UserRole } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type UserFormProps = {
  user?: Prisma.UserGetPayload<{
    select: {
      id: true;
      name: true;
      email: true;
      image: true;
      role: true;
    };
  }>;
};

export const UserForm = ({ user }: UserFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use different form types based on whether we're creating or updating
  type FormValues = UserFormProps["user"] extends undefined
    ? CreateUserSchema
    : UpdateUserSchema;
  const schema = user ? updateUserSchema : createUserSchema;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: (user?.role as UserRole) || "DOSEN",
      image: user?.image || "",
    } as FormValues,
  });

  async function onSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);

      if (user) {
        const response = await updateUser(user.id, values as UpdateUserSchema);

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
                message: errors[0],
              });
            });
          }
          return;
        }
        toast.success("User berhasil diperbarui");
      } else {
        const response = await createUser(values as CreateUserSchema);

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
                message: errors[0],
              });
            });
          }
          return;
        }
        toast.success("User berhasil dibuat");
      }

      router.push("/admin/user");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  const watchName = form.watch("name");
  const initials = watchName ? watchName.charAt(0).toUpperCase() : "?";

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
                  <FormLabel>Nama</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan nama pengguna"
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
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan email pengguna"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {user
                      ? "Password Baru (kosongkan jika tidak ingin mengubah)"
                      : "Password"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={
                        user ? "Masukkan password baru" : "Masukkan password"
                      }
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {user
                      ? "Biarkan kosong jika tidak ingin mengubah password"
                      : "Password minimal 8 karakter dan wajib diisi untuk pengguna baru"}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Gambar Profil</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Masukkan URL gambar profil (opsional)"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormDescription>
                    URL gambar profil pengguna (opsional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih role pengguna" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                      <SelectItem value="DOSEN">Dosen</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Role menentukan hak akses pengguna dalam sistem
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
            onClick={() => router.push("/admin/user")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : user
                ? "Perbarui User"
                : "Buat User"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
