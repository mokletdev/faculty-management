import { BodyLG, H2 } from "@/components/ui/typography";
import { getRoomById } from "@/server/retrievers/room";
import { notFound } from "next/navigation";
import { RoomForm } from "./_components/room-form";

export const EditRoom = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 w-fit">
        <H2 className="text-primary-800 font-bold">Ubah Ruangan</H2>
        <BodyLG className="text-neutral-500">
          Perbarui detail ruangan yang ada dalam sistem FEMS.
        </BodyLG>
      </div>

      <RoomForm room={room} />
    </div>
  );
};
