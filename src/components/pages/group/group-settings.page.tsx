import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { getGoogleGroup } from "@/server/retrievers/groups";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GoogleGroupSettingsForm } from "./_components/group-settings";

export const GroupSettings = async () => {
  const groupEmail = (await getGoogleGroup()).groupEmail;

  if (!groupEmail) return notFound();

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <H2 className="text-primary-800 mb-1 font-bold tracking-tight">
            Pengaturan Google Calendar
          </H2>
          <p className="text-muted-foreground">
            Kelola ID Google Calendar yang dapat dibagikan untuk sinkronisasi
            agenda.
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali
          </Link>
        </Button>
      </div>

      <div className="mx-auto max-w-2xl">
        <GoogleGroupSettingsForm existingGroupEmail={groupEmail} />
      </div>
    </div>
  );
};
