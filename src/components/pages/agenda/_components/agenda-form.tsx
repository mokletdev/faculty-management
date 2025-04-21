"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { DateTimePicker } from "@/components/ui/datetime-picker";
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
  SearchableSelect,
  type SearchResult,
} from "@/components/ui/searchable-select";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  agendaSchema,
  type AgendaSchema,
} from "@/lib/validations/agenda.validator";
import { createAgenda, updateAgenda } from "@/server/actions/agenda.action";
import type { RoomSearchResult } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Priority, Prisma } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type AgendaFormProps = {
  agenda?: Prisma.AgendaGetPayload<{
    include: {
      room: true;
      accessDosen: {
        select: {
          userId: true;
          user: { select: { id: true; name: true; email: true } };
        };
      };
    };
  }>;
};

type DosenSearchResult = {
  id: string;
  name: string | null;
  email: string;
};

export const AgendaForm = ({ agenda }: AgendaFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<AgendaSchema>({
    resolver: zodResolver(agendaSchema),
    defaultValues: {
      title: agenda?.title || "",
      description: agenda?.description || "",
      startTime: agenda ? new Date(agenda.startTime) : new Date(),
      endTime: agenda
        ? new Date(agenda.endTime)
        : // Default 1 hour later
          new Date(Date.now() + 60 * 60 * 1000),
      accessMahasiswa: agenda ? agenda.accessMahasiswa : false,
      accessAllDosen: agenda ? agenda.accessAllDosen : false,
      priority: (agenda?.priority as Priority) || "MEDIUM",
      roomId: agenda?.roomId || "",
      accessDosen: agenda?.accessDosen?.map((access) => access.userId) || [],
    } satisfies AgendaSchema,
  });

  const searchRooms = async (query: string): Promise<SearchResult[]> => {
    const startTime = form.getValues("startTime");
    const endTime = form.getValues("endTime");

    const response = await fetch(
      `/api/room/search?q=${encodeURIComponent(query)}&start=${startTime.toISOString()}&end=${endTime.toISOString()}`,
    );
    if (!response.ok) throw new Error("Gagal mencari ruangan");

    const results = (await response.json()) as RoomSearchResult[];
    return results.map((room) => ({
      id: room.id,
      display: room.name,
    }));
  };

  const searchDosens = async (
    query: string,
    extraParams?: { id?: string },
  ): Promise<SearchResult[]> => {
    const response = await fetch(
      `/api/dosen/search?q=${encodeURIComponent(query)}${extraParams?.id ? `&id=${extraParams.id}` : ""}`,
    );
    if (!response.ok) throw new Error("Gagal mencari dosen");
    const results = (await response.json()) as DosenSearchResult[];

    return results.map((dosen) => ({
      id: dosen.id,
      display: dosen.name + ` (${dosen.email})`,
    }));
  };

  async function onSubmit(values: AgendaSchema) {
    try {
      setIsSubmitting(true);

      if (values.endTime <= values.startTime) {
        form.setError("endTime", {
          type: "manual",
          message: "Waktu selesai harus setelah waktu mulai",
        });
        setIsSubmitting(false);
        return;
      }

      if (agenda) {
        const response = await updateAgenda(agenda.id, values);

        if (response.error) {
          const { message, fieldErrors } = response.error;
          toast.error(
            message +
              `${fieldErrors ? ": " + Object.keys(fieldErrors).join(", ") : null}`,
          );
          return;
        }
        toast.success("Agenda berhasil diperbarui");
      } else {
        const response = await createAgenda(values);

        if (response.error) {
          const { message, fieldErrors } = response.error;
          toast.error(
            message +
              `${fieldErrors ? ": " + Object.keys(fieldErrors).join(", ") : null}`,
          );
          return;
        }
        toast.success("Agenda berhasil dibuat");
      }

      router.push("/admin/agenda");
      router.refresh();
    } catch (error: any) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  const startTime = form.watch("startTime");
  const endTime = form.watch("endTime");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-2xl space-y-8"
      >
        <Card className="w-full max-w-2xl md:min-w-2xl">
          <CardContent className="space-y-6 pt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan judul agenda" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Deskripsi</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Masukkan deskripsi agenda"
                      className="min-h-[100px]"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Waktu Mulai</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Waktu Selesai</FormLabel>
                    <FormControl>
                      <DateTimePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {startTime && endTime && (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioritas</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Pilih prioritas" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="LOW">Rendah</SelectItem>
                          <SelectItem value="MEDIUM">Sedang</SelectItem>
                          <SelectItem value="HIGH">Tinggi</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="roomId"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>Ruangan</FormLabel>
                      <FormControl>
                        <SearchableSelect
                          placeholder="Cari ruangan yang tersedia..."
                          searchPlaceholder="Cari ruangan..."
                          value={field.value}
                          displayValue={
                            agenda
                              ? {
                                  display: agenda.room.name,
                                  id: agenda.roomId,
                                }
                              : undefined
                          }
                          onChange={field.onChange}
                          searchFunction={searchRooms}
                          searchParams={{
                            startTime: form
                              .getValues("startTime")
                              .toISOString(),
                            endTime: form.getValues("endTime").toISOString(),
                            excludeId: agenda?.id,
                          }}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <div className="space-y-4">
              <FormLabel>Pengaturan Akses</FormLabel>

              <FormField
                control={form.control}
                name="accessMahasiswa"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-neutral-200 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Izinkan Akses Mahasiswa</FormLabel>
                      <FormDescription>
                        Membuat agenda ini terlihat oleh semua mahasiswa
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="accessAllDosen"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border border-neutral-200 p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Izinkan Akses Semua Dosen</FormLabel>
                      <FormDescription>
                        Membuat agenda ini terlihat oleh semua anggota fakultas
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />

              {!form.watch("accessAllDosen") && (
                <FormField
                  control={form.control}
                  name="accessDosen"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Akses Dosen Tertentu</FormLabel>
                      <FormDescription className="mb-2 text-left">
                        Pilih dosen tertentu yang dapat mengakses agenda ini
                      </FormDescription>
                      <FormControl>
                        <SearchableSelect
                          placeholder="Cari anggota fakultas..."
                          searchPlaceholder="Cari anggota fakultas..."
                          value={field.value}
                          onChange={field.onChange}
                          searchFunction={searchDosens}
                          multiSelect={true}
                          initialSelectedItems={
                            agenda?.accessDosen
                              ? field.value?.map((userId) => {
                                  const dosens = agenda.accessDosen.map(
                                    (dosen) => dosen.user,
                                  );
                                  const dosen = dosens.find(
                                    (d) => d.id === userId,
                                  )!;

                                  return {
                                    id: userId,
                                    display: `${dosen.name ?? "Unknown"} (${dosen.email ?? "unknown"})`,
                                  };
                                }) || []
                              : []
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin/agenda")}
          >
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Menyimpan..."
              : agenda
                ? "Perbarui Agenda"
                : "Buat Agenda"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
