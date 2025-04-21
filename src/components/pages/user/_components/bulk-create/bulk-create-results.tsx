"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { BulkCreateResult } from "@/types";
import { CheckCircle2, Download } from "lucide-react";
import { useState } from "react";

interface BulkCreateResultsProps {
  results: BulkCreateResult;
}

export function BulkCreateResults({ results }: BulkCreateResultsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    results.failedUsers.length > 0 ? "failed" : "summary",
  );

  const downloadFailedUsers = () => {
    if (!results.failedUsers.length) return;

    const headers = "index,email,error\n";
    const csvContent =
      headers +
      results.failedUsers
        .map((user) => `${user.index},${user.email},"${user.error}"`)
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "failed-users.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const successRate = Math.round(
    (results.successCount / results.totalProcessed) * 100,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Hasil Pemrosesan</CardTitle>
        <CardDescription>
          {results.successCount} dari {results.totalProcessed} pengguna berhasil
          ditambahkan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="summary">Ringkasan</TabsTrigger>
            <TabsTrigger value="failed" disabled={!results.failedUsers.length}>
              Gagal ({results.failedUsers.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-4 space-y-4">
            <div className="flex items-center justify-center gap-8 rounded-lg border p-6">
              <div className="text-center">
                <div className="text-4xl font-bold">
                  {results.totalProcessed}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  Total Diproses
                </div>
              </div>
              <div className="text-center">
                <div className="text-primary-800 text-4xl font-bold">
                  {results.successCount}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">
                  Berhasil
                </div>
              </div>
              <div className="text-center">
                <div className="text-destructive text-4xl font-bold">
                  {results.failedUsers.length}
                </div>
                <div className="text-muted-foreground mt-1 text-sm">Gagal</div>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-lg border p-4">
              <div
                className={`text-2xl font-bold ${successRate >= 70 ? "text-primary-800" : successRate >= 40 ? "text-amber-500" : "text-red-500"}`}
              >
                {successRate}%
              </div>
              <div className="flex-1">
                <div className="bg-muted h-2 w-full rounded-full">
                  <div
                    className={`h-2 rounded-full ${successRate >= 70 ? "bg-primary-800" : successRate >= 40 ? "bg-amber-500" : "bg-red-500"}`}
                    style={{ width: `${successRate}%` }}
                  />
                </div>
              </div>
              <div className="text-muted-foreground text-sm">
                Tingkat Keberhasilan
              </div>
            </div>

            {results.failedUsers.length > 0 && (
              <div className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveTab("failed")}
                >
                  Lihat {results.failedUsers.length} Pengguna Gagal
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="failed" className="mt-4">
            {results.failedUsers.length > 0 ? (
              <>
                <div className="mb-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={downloadFailedUsers}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Unduh Daftar Gagal
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>No.</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Alasan Gagal</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.failedUsers.map((user, idx) => (
                        <TableRow key={idx}>
                          <TableCell>{user.index + 1}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.error}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : (
              <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
                <div className="text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="text-primary-800 h-5 w-5" />
                  <span>Semua pengguna berhasil ditambahkan</span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
