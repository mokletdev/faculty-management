import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function CSVTemplateData() {
  const columns = [
    {
      name: "name",
      description: "Nama lengkap pengguna",
      required: true,
      example: "John Doe",
    },
    {
      name: "email",
      description: "Alamat email pengguna (harus unik)",
      required: true,
      example: "john@example.com",
    },
    {
      name: "password",
      description: "Password pengguna (min. 8 karakter)",
      required: true,
      example: "password123",
    },
    {
      name: "role",
      description: "Peran pengguna (ADMIN atau DOSEN)",
      required: true,
      example: "DOSEN",
    },
    {
      name: "image",
      description: "URL gambar profil",
      required: false,
      example: "https://example.com/image.jpg",
    },
  ];

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kolom</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Wajib</TableHead>
              <TableHead>Contoh</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {columns.map((column) => (
              <TableRow key={column.name}>
                <TableCell className="font-medium">{column.name}</TableCell>
                <TableCell>{column.description}</TableCell>
                <TableCell>{column.required ? "Ya" : "Tidak"}</TableCell>
                <TableCell className="font-mono text-xs">
                  {column.example}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium">Contoh CSV:</h4>
        <pre className="bg-muted overflow-x-auto rounded-md p-4 text-xs">
          name,email,password,role,image
          <br />
          John
          Doe,john@example.com,password123,DOSEN,https://example.com/john.jpg
          <br />
          Jane Smith,jane@example.com,password456,ADMIN,
          <br />
          Bob Johnson,bob@example.com,password789,DOSEN,
        </pre>
      </div>

      <div className="bg-muted/50 rounded-md border p-4">
        <h4 className="font-medium">Catatan Penting:</h4>
        <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
          <li>
            Pastikan email bersifat unik dan belum terdaftar dalam sistem.
          </li>
          <li>Password harus memiliki minimal 8 karakter.</li>
          <li>Role harus salah satu dari: ADMIN atau DOSEN.</li>
          <li>Kolom image bersifat opsional dan dapat dikosongkan.</li>
          <li>Baris pertama harus berisi nama kolom seperti pada contoh.</li>
        </ul>
      </div>
    </div>
  );
}
