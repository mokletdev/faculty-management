"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { saveGroupEmail } from "@/server/actions/group.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Copy, ExternalLink, RefreshCw, Users } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const groupEmailSchema = z.object({
  groupEmail: z
    .string()
    .min(1, "Google Group Email tidak boleh kosong")
    .regex(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Format Google Group Email tidak valid. Gunakan format email seperti group-name@googlegroups.com",
    ),
});

type GroupEmailFormValues = z.infer<typeof groupEmailSchema>;

interface GroupSettingsFormProps {
  existingGroupEmail: string;
}

export const GoogleGroupSettingsForm = ({
  existingGroupEmail,
}: GroupSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<GroupEmailFormValues>({
    resolver: zodResolver(groupEmailSchema),
    defaultValues: {
      groupEmail: existingGroupEmail,
    },
  });

  async function onSubmit(values: GroupEmailFormValues) {
    try {
      setIsSubmitting(true);
      const response = await saveGroupEmail(values.groupEmail);

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      toast.success(
        existingGroupEmail
          ? "Google Group Email berhasil diperbarui"
          : "Google Group Email berhasil disimpan",
      );
    } catch (error) {
      console.error("Error saving Google Group email:", error);
      toast.error("Gagal menyimpan Google Group Email");
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = () => {
    const groupEmail = form.getValues("groupEmail");
    if (!groupEmail) {
      toast.error("Tidak ada Google Group Email untuk disalin");
      return;
    }

    navigator.clipboard
      .writeText(groupEmail)
      .catch((err) => console.error(err));
    toast.success("Google Group Email disalin ke clipboard");
  };

  const openGroupInNewTab = () => {
    const groupEmail = form.getValues("groupEmail");
    if (!groupEmail) {
      toast.error("Tidak ada Google Group Email untuk dibuka");
      return;
    }

    window.open(
      `https://groups.google.com/g/${groupEmail.split("@")[0]}`,
      "_blank",
    );
  };

  const resetForm = () => {
    form.reset({
      groupEmail: existingGroupEmail,
    });
    toast.info("Form direset ke nilai awal");
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Pengaturan Google Group</CardTitle>
        <CardDescription>
          Tetapkan Google Group Email yang akan digunakan untuk berbagi akses
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-4">
              <Users className="text-primary h-6 w-6" />
              <div>
                <p className="font-medium">Google Group Email</p>
                <p className="text-muted-foreground text-sm">
                  Alamat email Google Group digunakan untuk berbagi akses ke
                  dokumen dan kalender secara otomatis.
                </p>
              </div>
            </div>

            {existingGroupEmail && (
              <div className="bg-muted rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Group Email Saat Ini:</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      title="Salin Email"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={openGroupInNewTab}
                      title="Buka Google Groups"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 font-mono text-sm">{existingGroupEmail}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="groupEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {existingGroupEmail
                      ? "Perbarui Group Email"
                      : "Group Email"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="group-name@googlegroups.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan alamat email Google Group dalam format email
                    seperti group-name@googlegroups.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md border bg-amber-50 p-4 text-amber-800">
              <p className="text-sm font-medium">Catatan Penting:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Pastikan Google Group telah dibuat dan dikonfigurasi dengan
                  benar di Google Groups.
                </li>
                <li>
                  Semua anggota dalam group ini akan mendapatkan akses ke
                  dokumen dan kalender yang dibagikan.
                </li>
                <li>
                  Perubahan alamat email group akan mempengaruhi semua dokumen
                  dan akses yang telah dibagikan sebelumnya.
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="mt-6 flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : existingGroupEmail
                  ? "Perbarui Group Email"
                  : "Simpan Group Email"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
