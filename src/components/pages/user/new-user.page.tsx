import { BodyLG, H2 } from "@/components/ui/typography";
import { UserForm } from "./_components/user-form";

export const NewUser = async () => {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 w-fit">
        <H2 className="text-primary-800 font-bold tracking-tight">
          Buat Pengguna Baru
        </H2>
        <BodyLG className="text-neutral-500">
          Tambahkan akun pengguna baru ke sitem FESM.
        </BodyLG>
      </div>

      <UserForm />
    </div>
  );
};
