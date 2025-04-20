import { PageContainer } from "@/components/layout/page.layout";
import { SectionContainer } from "@/components/layout/section.layout";
import { AgendaForm } from "@/components/pages/agenda/_components/agenda-form";
import { BodyLG, H2 } from "@/components/ui/typography";
import { getAgendaById } from "@/server/retrievers/agenda";
import { notFound } from "next/navigation";

export const EditAgenda = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const agenda = await getAgendaById(id);

  if (!agenda) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 w-fit">
        <H2 className="text-primary-800 font-bold">Ubah Agenda</H2>
        <BodyLG className="text-neutral-500">
          Perbarui detail kegiatan fakultas atau aktivitas.
        </BodyLG>
      </div>

      <AgendaForm agenda={agenda} />
    </div>
  );
};
