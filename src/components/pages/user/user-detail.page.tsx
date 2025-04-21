import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BodyBase, H2 } from "@/components/ui/typography";
import { getUserById } from "@/server/retrievers/user";
import { CalendarClock, Edit, Mail, UserIcon } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgendaList } from "./_components/user-detail/agenda-list";
import { NotificationList } from "./_components/user-detail/notification-list";
import { UserStats } from "./_components/user-detail/user-stats";

export const UserDetail = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const user = await getUserById(id);

  if (!user) {
    return notFound();
  }

  return (
    <div className="container mx-auto space-y-8 py-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <H2 className="text-primary-800 mb-1 font-bold tracking-tight">
            Detail Pengguna
          </H2>
          <BodyBase className="text-neutral-500">
            Informasi lengkap tentang pengguna.
          </BodyBase>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/user">Kembali</Link>
          </Button>
          <Button asChild>
            <Link href={`/admin/user/${user.id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Profil</CardTitle>
              <CardDescription>Informasi dasar pengguna</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 text-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={user.image ?? ""}
                    alt={user.name ?? "User"}
                  />
                  <AvatarFallback className="text-xl">
                    {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <h3 className="text-xl font-semibold">
                    {user.name ?? "Unnamed User"}
                  </h3>
                  <div className="text-muted-foreground flex items-center justify-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{user.email}</span>
                  </div>
                </div>

                <Badge
                  variant={user.role === "ADMIN" ? "default" : "secondary"}
                  className="capitalize"
                >
                  {user.role.toLowerCase()}
                </Badge>
              </div>

              <div className="mt-6 space-y-4">
                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">ID</span>
                  <span className="max-w-[180px] truncate" title={user.id}>
                    {user.id}
                  </span>
                </div>

                <div className="flex justify-between border-b pb-2">
                  <span className="font-medium">Role</span>
                  <span className="capitalize">{user.role.toLowerCase()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <UserStats userId={user.id} className="mt-6" />
        </div>

        <div className="lg:col-span-2">
          <Tabs
            defaultValue={user.role === "ADMIN" ? "agendas" : "access"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              {user.role === "ADMIN" && (
                <TabsTrigger value="agendas">Agenda</TabsTrigger>
              )}
              {user.role === "DOSEN" && (
                <>
                  <TabsTrigger value="access">Akses</TabsTrigger>
                  <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
                </>
              )}
            </TabsList>

            <TabsContent value="agendas" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <CalendarClock className="h-5 w-5" />
                        Agenda Dibuat
                      </CardTitle>
                      <CardDescription>
                        Agenda yang dibuat oleh pengguna ini
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/agenda`}>Lihat Semua</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AgendaList userId={user.id} type="created" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="access" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <UserIcon className="h-5 w-5" />
                        Akses Agenda
                      </CardTitle>
                      <CardDescription>
                        Agenda yang dapat diakses oleh pengguna ini
                      </CardDescription>
                    </div>
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/agenda`}>Lihat Semua</Link>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <AgendaList userId={user.id} type="access" />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="mt-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Notifikasi</CardTitle>
                  <CardDescription>
                    Notifikasi yang diterima pengguna
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <NotificationList userId={user.id} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
