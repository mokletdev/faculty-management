import { Button } from "@/components/ui/button";
import { H2 } from "@/components/ui/typography";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { BulkCreateForm } from "./_components/bulk-create/bulk-create-form";

export const BulkCreateUsers = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <H2 className="text-primary-800 mb-1 font-bold tracking-tight">
            Tambah Pengguna Massal
          </H2>
          <p className="text-muted-foreground">
            Tambahkan beberapa pengguna sekaligus dengan mengunggah file CSV
            (.csv) atau Excel (.xlsx/.xls).
          </p>
        </div>
        <Button variant="outline" asChild>
          <Link href="/admin/user">Kembali</Link>
        </Button>
      </div>

      <BulkCreateForm />
    </div>
  );
};
