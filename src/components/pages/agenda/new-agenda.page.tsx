import { PageContainer } from "@/components/layout/page.layout";
import { SectionContainer } from "@/components/layout/section.layout";
import { BodyLG, H2 } from "@/components/ui/typography";
import { getDosens, getRooms } from "@/server/retrievers/agenda";
import { AgendaForm } from "./_components/agenda-form";

export const NewAgenda = async () => {
  const now = new Date();
  const rooms = await getRooms();
  const dosens = await getDosens();

  return (
    <PageContainer>
      <SectionContainer>
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 w-fit">
            <H2 className="text-primary-800 font-bold tracking-tight">
              Buat Agenda Baru
            </H2>
            <BodyLG className="text-neutral-500">
              Tambahkan kegiatan fakultas atau aktivitas ke kalender.
            </BodyLG>
          </div>

          <AgendaForm rooms={rooms} dosens={dosens} />
        </div>
      </SectionContainer>
    </PageContainer>
  );
};
