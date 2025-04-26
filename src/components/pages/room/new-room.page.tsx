import { BodyLG, H2 } from "@/components/ui/typography";
import { RoomForm } from "./_components/room-form";

export const NewRoom = async () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 w-fit">
        <H2 className="text-primary-800 font-bold tracking-tight">
          Buat Ruangan Baru
        </H2>
        <BodyLG className="text-neutral-500">
          Tambahkan ruangan baru ke dalam sistem FEMS.
        </BodyLG>
      </div>

      <RoomForm />
    </div>
  );
};
