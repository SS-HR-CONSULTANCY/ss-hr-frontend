import type { AdminFetchReportTableDataResponse } from "@/types/apiTypes/admin";
import jsPDF from "jspdf";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";

/**
 * Export given data to Excel
 * @param fileName - Name of the file (without extension)
 * @param sheetName - Name of the Excel sheet
 * @param data - Array of objects to export
 */
export const exportToExcel = (fileName: string, sheetName: string, data: object[]) => {
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

/**
 * Export given data to PDF
 * @param fileName - Name of the file (without extension)
 * @param title - Title to display on PDF
 * @param data - Array of objects to export
 */
export const exportToPDF = (fileName: string, title: string, data: object[]) => {
  const doc = new jsPDF();
  doc.text(title, 10, 10);
  let y = 20;

  data.forEach((row) => {
    doc.text(JSON.stringify(row), 10, y);
    y += 10;
  });

  doc.save(`${fileName}.pdf`);
};



export const handleExportExcel = async (e: React.MouseEvent<HTMLButtonElement>, reportData: Array<AdminFetchReportTableDataResponse>, activeTab: string) => {
    e.preventDefault();
    console.log("hi")
    
    if (!reportData || !Array.isArray(reportData)) {
        toast.error("No report in the table");
        return;
    }
    try {
        await exportToExcel(`${activeTab}-report`, "Report", reportData);
        toast.success("Excel file exported successfully!");
    } catch (error) {
        toast.error("Failed to export Excel file. Please try again.");
        console.error("Export to Excel error:", error);
    }
};

export const handleExportPDF = async (e: React.MouseEvent<HTMLButtonElement>, reportData: Array<AdminFetchReportTableDataResponse>, activeTab: string) => {
    e.preventDefault();
    
    if (!reportData || !Array.isArray(reportData)) {
        toast.error("No report in the table");
        return;
    }
    try {
        await exportToPDF(`${activeTab}-report`, `${activeTab.toUpperCase()} REPORT`, reportData);
        toast.success("PDF file exported successfully!");
    } catch (error) {
        toast.error("Failed to export PDF file. Please try again.");
        console.error("Export to PDF error:", error);
    }
};