import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { BulkUserData } from "./validations/user.validator";

export const parseCSV = async (file: File): Promise<BulkUserData[]> => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const data = results.data as Record<string, string>[];
          const formattedData = data.map((row) => ({
            name: row.name?.trim() ?? "",
            email: row.email?.trim() ?? "",
            password: row.password?.trim() ?? "",
            role:
              (row.role?.trim().toUpperCase() as "ADMIN" | "DOSEN") ?? "DOSEN",
            image: row.image?.trim() ?? undefined,
          }));
          resolve(formattedData);
        } catch (error) {
          reject(error as Error);
        }
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const parseExcel = async (file: File): Promise<BulkUserData[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName!]!;
        const jsonData: Record<string, string>[] =
          XLSX.utils.sheet_to_json(worksheet);

        const formattedData = jsonData.map((row) => ({
          name: row.name?.trim() ?? "",
          email: row.email?.trim() ?? "",
          password: row.password?.trim() ?? "",
          role:
            (row.role?.trim().toUpperCase() as "ADMIN" | "DOSEN") ?? "DOSEN",
          image: row.image?.trim() ?? undefined,
        }));
        resolve(formattedData);
      } catch (error) {
        reject(error as Error);
      }
    };
    reader.onerror = (error) => reject(error as unknown as Error);
    reader.readAsArrayBuffer(file);
  });
};
