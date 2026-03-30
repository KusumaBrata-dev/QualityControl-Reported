import ExcelJS from "exceljs";
import { PRODUCTS } from "../qcConstants";

/**
 * Parses an Excel file (.xlsx) and maps the rows back to report objects.
 * @param {File} file - The uploaded Excel file
 * @returns {Promise<Array<Object>>} - Array of report data objects ready to be saved
 */
export async function parseExcelImport(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = async (e) => {
      try {
        const buffer = e.target.result;
        const wb = new ExcelJS.Workbook();
        await wb.xlsx.load(buffer);
        
        const ws = wb.getWorksheet(1); // Read first sheet
        if (!ws) {
          throw new Error("Worksheet tidak ditemukan");
        }
        
        const data = [];
        let isFirstRow = true;
        
        ws.eachRow((row, rowNumber) => {
          if (isFirstRow) {
            isFirstRow = false; // Skip header row
            return;
          }
          
          const getVal = (idx) => {
            const cell = row.getCell(idx);
            // Handle rich text, formula, or plain string values
            let val = cell.value;
            if (val && typeof val === 'object') {
              val = val.text || val.result || String(val);
            }
            return (val?.toString() || "").trim();
          };

          const modelName = getVal(2);
          const colorName = getVal(3);
          
          // Find product ID based on model and color constraints
          let productId = "";
          for (const [id, prod] of Object.entries(PRODUCTS)) {
             if (prod.model === modelName && prod.color === colorName) {
                productId = Number(id);
                break;
             }
          }
          
          if (!productId) return; // Skip row if product is unknown

          const sns = getVal(4).split(",").map(s => s.trim()).filter(Boolean);
          const statusVal = getVal(17).toLowerCase();
          const isPass = statusVal === "pass";
          
          data.push({
             product_id: productId,
             model: modelName,
             color: colorName,
             batch_no: getVal(5) || "UNKNOWN_BATCH",
             production_date: getVal(6) || new Date().toISOString().split("T")[0],
             inspection_date: getVal(7).replace(" ", "T") || new Date().toISOString(),
             qty_produced: Number(getVal(8)) || 0,
             qty_inspected: Number(getVal(9)) || 0,
             qty_pass: Number(getVal(10)) || 0,
             qty_fail: Number(getVal(11)) || 0,
             qty_rework: Number(getVal(12)) || 0,
             defect_rate: Number((Number(getVal(11)) / (Number(getVal(9)) || 1) * 100).toFixed(2)) || 0,
             station: getVal(14) === "–" ? "" : getVal(14),
             defect_cat: getVal(15) === "–" ? "" : getVal(15),
             defect_loc: getVal(16) === "–" ? "" : getVal(16),
             overall_status: isPass ? "pass" : "fail",
             serial_numbers: sns,
             notes: getVal(18) || "",
             images: [],
             checkpoints: []
          });
        });
        
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
