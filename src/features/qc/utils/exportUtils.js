import ExcelJS from "exceljs";
import { genNo } from "../qcConstants";

/** 
 * exportToExcel - Modernized Excel export using exceljs
 * @param {Array} data - The report data array
 * @param {string} filename - Base filename
 * @param {Object} options - Optional filters/metadata
 */
export async function exportToExcel(data, filename = "QC_Report", options = {}) {
  if (!data.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("QC Reports");

  // Freeze top row
  ws.views = [{ state: "frozen", ySplit: 1 }];

  // Column definitions
  ws.columns = [
    { key: "rno",   header: "Report No",      width: 18 },
    { key: "model", header: "Model",          width: 15 },
    { key: "color", header: "Warna",          width: 12 },
    { key: "batch", header: "Batch No",        width: 22 },
    { key: "pdate", header: "Tgl Produksi",    width: 14 },
    { key: "idate", header: "Tgl Inspeksi",    width: 20 },
    { key: "prod",  header: "Diproduksi",      width: 12 },
    { key: "insp",  header: "Diperiksa",       width: 12 },
    { key: "pass",  header: "Pass",            width: 8 },
    { key: "fail",  header: "Fail",            width: 8 },
    { key: "rework",header: "Rework",          width: 8 },
    { key: "dr",    header: "Defect Rate (%)", width: 15 },
    { key: "stn",   header: "Stasiun",         width: 12 },
    { key: "dcat",  header: "Jenis Defect",    width: 22 },
    { key: "dloc",  header: "Lokasi Defect",   width: 18 },
    { key: "status",header: "Status",          width: 10 },
    { key: "sns",   header: "Serial Number",   width: 45 },
    { key: "notes", header: "Catatan",         width: 35 },
  ];

  // Styling for header
  const headerRow = ws.getRow(1);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1C3A6E" }, // Dark blue
    };
    cell.font = {
      bold: true,
      color: { argb: "FFFFFFFF" },
      size: 11,
      name: "Calibri",
    };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // Add data rows
  data.forEach((r) => {
    const isPass = r.overall_status === "pass";
    const dr = Number(r.defect_rate || 0);
    
    const row = ws.addRow({
      rno: genNo(r.id, r.created_at),
      model: r.model,
      color: r.color,
      batch: r.batch_no,
      pdate: r.production_date,
      idate: (r.inspection_date || "").replace("T", " "),
      prod: r.qty_produced,
      insp: r.qty_inspected,
      pass: r.qty_pass,
      fail: r.qty_fail,
      rework: r.qty_rework,
      dr: dr / 100, // For percentage formatting
      stn: r.station || "–",
      dcat: r.defect_cat || "–",
      dloc: r.defect_loc || "–",
      status: r.overall_status.toUpperCase(),
      sns: (r.serial_numbers || []).join(", "),
      notes: r.notes || "",
    });

    row.height = 20;

    // Row-level styling for Reject (Fail)
    if (!isPass) {
      row.eachCell((cell) => {
        // Subtle dark red background for reject rows
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFDF2F2" }, 
        };
      });
    }

    // Status cell formatting
    const statusCell = row.getCell("status");
    statusCell.font = {
      bold: true,
      color: { argb: isPass ? "FF15803D" : "FFDC2626" },
    };
    statusCell.alignment = { horizontal: "center", vertical: "middle" };

    // Defect Rate formatting
    const drCell = row.getCell("dr");
    drCell.numFmt = "0.00%";
    drCell.font = {
      bold: dr > 0,
      color: { argb: dr > 5 ? "FFDC2626" : dr > 2 ? "FFB45309" : "FF15803D" },
    };
    drCell.alignment = { horizontal: "right" };
  });

  // Summary Sheet
  const wsSum = wb.addWorksheet("Summary");
  wsSum.getColumn(1).width = 30;
  wsSum.getColumn(2).width = 20;

  const tFail = data.filter(r => r.overall_status === "fail").length;
  const tUnitInsp = data.reduce((a, r) => a + (Number(r.qty_inspected) || 0), 0);
  const avgDR = data.length ? (data.reduce((a, r) => a + (Number(r.defect_rate) || 0), 0) / data.length).toFixed(2) : 0;

  const summaryData = [
    ["RINGKASAN QC REPORT", ""],
    ["", ""],
    ["Total Laporan", data.length],
    ["Total Reject (Fail)", tFail],
    ["Total Unit Diperiksa", tUnitInsp],
    ["Rata-rata Defect Rate", `${avgDR}%`],
    ["", ""],
    ["Tanggal Export", new Date().toLocaleString("id-ID")],
    ["Filter Terpasang", options.filterDesc || "None"],
  ];

  summaryData.forEach((row, i) => {
    const r = wsSum.addRow(row);
    if (i === 0) {
      r.getCell(1).font = { bold: true, size: 16, color: { argb: "FF1E40AF" } };
    } else if (row[0] && i > 1) {
      r.getCell(1).font = { bold: true };
    }
  });

  // Finalize and Download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${filename}_${new Date().toISOString().split("T")[0]}.xlsx`;
  anchor.click();
  URL.revokeObjectURL(url);
}
