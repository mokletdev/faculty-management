import { BodyLG, H2 } from "@/components/ui/typography";
import { getUserById } from "@/server/retrievers/user";
import { notFound } from "next/navigation";
import { UserForm } from "./_components/user-form";

export const EditUser = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const user = await getUserById(id);

  if (!user) {
    notFound();
  }

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-4 w-fit">
        <H2 className="text-primary-800 font-bold">Ubah Pengguna</H2>
        <BodyLG className="text-neutral-500">
          Perbarui detail akun pengguna yang telah dibuat.
        </BodyLG>
      </div>

      <UserForm user={user} />
    </div>
  );
};
