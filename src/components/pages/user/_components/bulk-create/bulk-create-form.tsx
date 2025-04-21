"use client";

import type React from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseCSV, parseExcel } from "@/lib/bulk-file-parsers";
import {
  validateUserData,
  type BulkUserData,
} from "@/lib/validations/user.validator";
import { bulkCreateUsers } from "@/server/actions/user.action";
import type { BulkCreateResult } from "@/types";
import { AlertCircle, Download, FileSpreadsheet, Upload } from "lucide-react";
import { useState } from "react";
import { BulkCreateResults } from "./bulk-create-results";
import { CSVTemplateData } from "./csv-template-data";

export function BulkCreateForm() {
  const [file, setFile] = useState<File | null>(null);
  const [userData, setUserData] = useState<BulkUserData[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    Record<number, string[]>
  >({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<BulkCreateResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setUserData([]);
    setValidationErrors({});
    setResults(null);

    try {
      let parsedData: BulkUserData[] = [];

      if (selectedFile.name.endsWith(".csv")) {
        parsedData = await parseCSV(selectedFile);
      } else if (
        selectedFile.name.endsWith(".xlsx") ||
        selectedFile.name.endsWith(".xls")
      ) {
        parsedData = await parseExcel(selectedFile);
      } else {
        alert(
          "Format file tidak didukung. Silakan unggah file CSV atau Excel.",
        );
        setFile(null);
        return;
      }

      const { validData, errors } = validateUserData(parsedData);
      setUserData(validData);
      setValidationErrors(errors);
    } catch (error) {
      console.error("Error parsing file:", error);
      // WARNING: malas implement custom dialog
      alert(
        "Gagal memproses file. Pastikan format file sesuai dengan template.",
      );
      setFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData.length) return;

    try {
      setIsProcessing(true);
      setProgress(0);
      setResults(null);

      const batchSize = 50;
      const totalBatches = Math.ceil(userData.length / batchSize);

      console.log("Total Batches:", totalBatches);

      let processedCount = 0;
      let successCount = 0;
      let failedUsers: { index: number; email: string; error: string }[] = [];

      for (let i = 0; i < userData.length; i += batchSize) {
        const batch = userData.slice(i, i + batchSize);
        const result = await bulkCreateUsers(batch, i);

        processedCount += batch.length;
        successCount += result.successCount;
        failedUsers = [...failedUsers, ...result.failedUsers];

        setProgress(Math.round((processedCount / userData.length) * 100));
      }

      setResults({
        totalProcessed: userData.length,
        successCount,
        failedUsers,
      });
    } catch (error) {
      console.error("Error processing users:", error);
      alert("Terjadi kesalahan saat memproses pengguna.");
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent =
      "name,email,password,role\nJohn Doe,john@example.com,password123,DOSEN\nJane Smith,jane@example.com,password456,ADMIN";
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "user-template.csv";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const hasValidationErrors = Object.keys(validationErrors).length > 0;

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Unggah File</TabsTrigger>
          <TabsTrigger value="template">Template</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Unggah Data Pengguna</CardTitle>
              <CardDescription>
                Unggah file CSV atau Excel yang berisi data pengguna untuk
                ditambahkan secara massal.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="file-upload">File CSV atau Excel</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="file-upload"
                        type="file"
                        accept=".csv,.xlsx,.xls"
                        onChange={handleFileChange}
                        disabled={isProcessing}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={downloadTemplate}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Template
                      </Button>
                    </div>
                    <p className="text-muted-foreground text-xs">
                      Format: name, email, password, role (ADMIN atau DOSEN)
                    </p>
                  </div>

                  {file && (
                    <div className="bg-muted rounded-md p-4">
                      <div className="flex items-center gap-2">
                        <FileSpreadsheet className="text-muted-foreground h-5 w-5" />
                        <span className="font-medium">{file.name}</span>
                        <span className="text-muted-foreground text-xs">
                          ({(file.size / 1024).toFixed(2)} KB)
                        </span>
                      </div>
                      <div className="mt-2 text-sm">
                        <span className="font-medium">{userData.length}</span>{" "}
                        pengguna ditemukan dalam file
                      </div>
                    </div>
                  )}

                  {hasValidationErrors && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Validasi Gagal</AlertTitle>
                      <AlertDescription>
                        Beberapa data pengguna tidak valid. Silakan perbaiki dan
                        unggah kembali.
                        <ul className="mt-2 list-inside list-disc">
                          {Object.entries(validationErrors).map(
                            ([index, errors]) => (
                              <li key={index}>
                                Baris {Number.parseInt(index) + 1}:{" "}
                                {errors.join(", ")}
                              </li>
                            ),
                          )}
                        </ul>
                      </AlertDescription>
                    </Alert>
                  )}

                  {isProcessing && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Memproses pengguna...</span>
                        <span>{progress}%</span>
                      </div>
                      <Progress value={progress} className="h-2 w-full" />
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button
                    type="submit"
                    disabled={
                      !userData.length || hasValidationErrors || isProcessing
                    }
                    className="w-full"
                  >
                    {isProcessing ? (
                      "Memproses..."
                    ) : (
                      <>
                        <Upload className="mr-2 h-4 w-4" />
                        Proses {userData.length} Pengguna
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Template Data Pengguna</CardTitle>
              <CardDescription>
                Gunakan format berikut untuk menyiapkan file CSV atau Excel
                Anda.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CSVTemplateData />
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={downloadTemplate}
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Unduh Template CSV
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {results && <BulkCreateResults results={results} />}
    </div>
  );
}
