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
import { saveCalendarId } from "@/server/actions/calendar.action";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar, Copy, ExternalLink, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const calendarIdSchema = z.object({
  calendarId: z
    .string()
    .min(1, "ID Calendar tidak boleh kosong")
    .regex(
      /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/,
      "Format ID Calendar tidak valid. Gunakan format email seperti xxx@group.calendar.google.com",
    ),
});

type CalendarIdFormValues = z.infer<typeof calendarIdSchema>;

interface CalendarSettingsFormProps {
  existingCalendarId: string;
}

export const CalendarSettingsForm = ({
  existingCalendarId,
}: CalendarSettingsFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<CalendarIdFormValues>({
    resolver: zodResolver(calendarIdSchema),
    defaultValues: {
      calendarId: existingCalendarId,
    },
  });

  async function onSubmit(values: CalendarIdFormValues) {
    try {
      setIsSubmitting(true);
      const response = await saveCalendarId(values.calendarId);

      if (response.error) {
        toast.error(response.error.message);
        return;
      }

      toast.success(
        existingCalendarId
          ? "ID Calendar berhasil diperbarui"
          : "ID Calendar berhasil disimpan",
      );
    } catch (error) {
      console.error("Error saving calendar ID:", error);
      toast.error("Gagal menyimpan ID Calendar");
    } finally {
      setIsSubmitting(false);
    }
  }

  const copyToClipboard = () => {
    const calendarId = form.getValues("calendarId");
    if (!calendarId) {
      toast.error("Tidak ada ID Calendar untuk disalin");
      return;
    }

    navigator.clipboard
      .writeText(calendarId)
      .catch((err) => console.error(err));
    toast.success("ID Calendar disalin ke clipboard");
  };

  const openCalendarInNewTab = () => {
    const calendarId = form.getValues("calendarId");
    if (!calendarId) {
      toast.error("Tidak ada ID Calendar untuk dibuka");
      return;
    }

    window.open(
      `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(calendarId)}`,
      "_blank",
    );
  };

  const resetForm = () => {
    form.reset({
      calendarId: existingCalendarId,
    });
    toast.info("Form direset ke nilai awal");
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Pengaturan Google Calendar</CardTitle>
        <CardDescription>
          Tetapkan ID Google Calendar yang akan digunakan untuk sinkronisasi
          agenda
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="bg-muted/50 flex items-center gap-3 rounded-lg border p-4">
              <Calendar className="text-primary h-6 w-6" />
              <div>
                <p className="font-medium">Google Calendar ID</p>
                <p className="text-muted-foreground text-sm">
                  ID Calendar dapat ditemukan di pengaturan Google Calendar
                  Anda. Pastikan calendar diatur sebagai "Public" agar dapat
                  diakses oleh sistem.
                </p>
              </div>
            </div>

            {existingCalendarId && (
              <div className="bg-muted rounded-md border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">ID Calendar Saat Ini:</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={copyToClipboard}
                      title="Salin ID"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={openCalendarInNewTab}
                      title="Buka di Google Calendar"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-2 font-mono text-sm">{existingCalendarId}</p>
              </div>
            )}

            <FormField
              control={form.control}
              name="calendarId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {existingCalendarId
                      ? "Perbarui ID Calendar"
                      : "ID Calendar"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="contoh@group.calendar.google.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Masukkan ID Google Calendar dalam format email seperti
                    xxx@group.calendar.google.com
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="rounded-md border bg-amber-50 p-4 text-amber-800">
              <p className="text-sm font-medium">Catatan Penting:</p>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>
                  Pastikan calendar diatur sebagai "Public" di pengaturan Google
                  Calendar.
                </li>
                <li>
                  Hanya satu ID Calendar yang dapat digunakan untuk
                  sinkronisasi.
                </li>
                <li>
                  Perubahan ID Calendar akan memengaruhi semua agenda yang telah
                  disinkronkan sebelumnya.
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between gap-4">
            <Button type="button" variant="outline" onClick={resetForm}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? "Menyimpan..."
                : existingCalendarId
                  ? "Perbarui ID Calendar"
                  : "Simpan ID Calendar"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
};
