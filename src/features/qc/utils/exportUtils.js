import ExcelJS from "exceljs";
import { genNo, DEFECT_CATS } from "../qcConstants";

/**
 * exportToExcel - Comprehensive Visual Report with Summary Dashboard
 */
export async function exportToExcel(
  data,
  filename = "QC_Report",
  options = {},
) {
  if (!data.length) return;

  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Data Laporan");
  const wsGal = wb.addWorksheet("Galeri Foto");
  const wsSum = wb.addWorksheet("Ringkasan Executive");
  
  // Create a quick lookup map for defect labels
  const defectMap = {};
  DEFECT_CATS.forEach(d => { defectMap[d.v] = d.l; });

  // --- 3. RINGKASAN EXECUTIVE (SHEET 3) ---
  const tFail = data.filter((r) => r.overall_status === "fail").length;
  const tPass = data.length - tFail;
  const tInsp = data.reduce((a, r) => a + (Number(r.qty_inspected) || 0), 0);
  const avgDR = (
    data.reduce((a, r) => a + (Number(r.defect_rate) || 0), 0) / data.length
  ).toFixed(2);

  wsSum.getColumn(1).width = 25;
  wsSum.getColumn(2).width = 20;

  wsSum.addRow(["QC PERFORMANCE SUMMARY"]).font = {
    bold: true,
    size: 16,
    color: { argb: "FF1E3A8A" },
  };
  wsSum.addRow(["Dicetak Pada:", new Date().toLocaleString("id-ID")]);
  wsSum.addRow([]);

  const summaryHead = wsSum.addRow(["METRIK UTAMA", "HASIL"]);
  summaryHead.font = { bold: true, color: { argb: "FFFFFFFF" } };
  summaryHead.eachCell(
    (c) =>
      (c.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF334155" },
      }),
  );

  wsSum.addRow(["Total Unit Diperiksa", tInsp]);
  wsSum.addRow(["Total Laporan (Batch)", data.length]);
  wsSum.addRow(["Jumlah Pass", tPass]);
  wsSum.addRow(["Jumlah Reject", tFail]);

  // Highlight Reject Rate
  wsSum.getCell("B8").font = {
    bold: true,
    color: { argb: Number(avgDR) > 5 ? "FFDC2626" : "FF15803D" },
  };

  wsSum.addRow([]);
  wsSum.addRow(["Top Defect Categories"]).font = { bold: true };

  // Calculate top defects
  const defectCounts = {};
  data.forEach((r) => {
    if (r.defect_cat && r.defect_cat !== "-") {
      const label = defectMap[r.defect_cat] || r.defect_cat;
      defectCounts[label] = (defectCounts[label] || 0) + 1;
    }
  });

  const sortedDefects = Object.entries(defectCounts).sort(
    (a, b) => b[1] - a[1],
  );
  sortedDefects.slice(0, 5).forEach(([cat, count]) => {
    wsSum.addRow([cat, count]);
  });

  // --- 1. DATA LAPORAN (SHEET 1) ---
  ws.columns = [
    { key: "rno", header: "ID LAPORAN", width: 18 },
    { key: "model", header: "MODEL", width: 15 },
    { key: "color", header: "WARNA", width: 12 },
    { key: "sns", header: "SERIAL NUMBER", width: 40 },
    { key: "status", header: "STATUS", width: 12 },
    { key: "fail", header: "REJECT", width: 8 },
    { key: "dcat", header: "JENIS DEFECT", width: 30 },
    { key: "dloc", header: "LOKASI", width: 18 },
    { key: "notes", header: "CATATAN KHUSUS", width: 35 },
    { key: "view", header: "DOKUMENTASI", width: 18 },
  ];

  const headerRow = ws.getRow(1);
  headerRow.height = 30;
  headerRow.eachCell((c) => {
    c.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF1E293B" },
    };
    c.font = { bold: true, color: { argb: "FFFFFFFF" } };
    c.alignment = { vertical: "middle", horizontal: "center" };
  });

  // --- 2. GALLERY SETUP (SHEET 2) ---
  wsGal.getColumn(1).width = 40;
  wsGal.getColumn(2).width = 100;
  let galRow = 1;

  // --- 4. FILL DATA ---
  for (let i = 0; i < data.length; i++) {
    const r = data[i];
    const rno = genNo(r.id, r.created_at);
    const defectLabel = defectMap[r.defect_cat] || r.defect_cat || "-";
    
    const row = ws.addRow({
      rno: rno,
      model: r.model,
      color: r.color,
      sns: (r.serial_numbers || []).join(", "),
      status: r.overall_status.toUpperCase(),
      fail: r.qty_fail,
      dcat: defectLabel,
      dloc: r.defect_loc || "-",
      notes: r.notes || "-",
    });

    const isFail = r.overall_status === "fail";
    row.eachCell((c) => {
      c.alignment = {
        vertical: "middle",
        horizontal: "center",
        wrapText: true,
      };
      if (isFail)
        c.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "FFFEE2E2" },
        };
    });

    // Gallery Logic
    if (r.images && r.images.length > 0) {
      const startGal = galRow;
      wsGal.addRow([`BUKTI FOTO ID: ${rno}`]).font = { bold: true };
      wsGal.addRow([`SN: ${r.serial_numbers?.join(", ") || "-"}`]);
      galRow += 2;

      for (const imgData of r.images.slice(0, 3)) {
        if (imgData.startsWith("data:image")) {
          const imgId = wb.addImage({ base64: imgData, extension: "jpeg" });
          wsGal.getRow(galRow).height = 280;
          wsGal.addImage(imgId, {
            tl: { col: 1, row: galRow - 1 },
            br: { col: 2, row: galRow },
          });
          galRow++;
        }
      }
      wsGal.getCell(`A${galRow}`).value = {
        text: "← Selesai / Kembali",
        hyperlink: `#'Data Laporan'!A${row.number}`,
      };
      wsGal.getCell(`A${galRow}`).font = {
        color: { argb: "FF2563EB" },
        underline: true,
      };
      galRow += 2;

      // Link from Master
      const linkCell = row.getCell("view");
      linkCell.value = {
        text: "LIHAT FOTO →",
        hyperlink: `#'Galeri Foto'!A${startGal}`,
      };
      linkCell.font = {
        color: { argb: "FF2563EB" },
        underline: true,
        bold: true,
      };
    } else {
      row.getCell("view").value = "-";
    }
  }

  // Freeze Headers
  ws.views = [{ state: "frozen", ySplit: 1 }];

  // Download
  const buffer = await wb.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${filename}_FULL_REPORT_${new Date().toISOString().split("T")[0]}.xlsx`;
  a.click();
  URL.revokeObjectURL(url);
}
