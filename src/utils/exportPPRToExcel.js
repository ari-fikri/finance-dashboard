import ExcelJS from "exceljs";

/**
 * Export PPR table data to Excel file.
 * @param {Object[]} filteredMspData - Array of part data.
 * @param {string[]} COST_ITEMS - Array of cost item names.
 * @param {string[]} ANALYSIS_COLUMNS - Array of analysis column names.
 * @param {string} selectedPeriod
 * @param {string} comparisonPeriod
 * @param {Function} calculateCostValues
 * @param {Function} calculateDiff
 * @param {Function} getAnalysisValue
 * @param {Function} getRemarkValue
 */
export async function exportPPRToExcel({
  filteredMspData,
  COST_ITEMS,
  ANALYSIS_COLUMNS,
  selectedPeriod,
  comparisonPeriod,
  calculateCostValues,
  calculateDiff,
  getAnalysisValue,
  getRemarkValue,
}) {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("PPR Table");

  // First header row
  worksheet.addRow([
    "Part No",
    "Importer",
    "Category",
    "Cost Item",
    "Calculation", "", "", "", "", "", // 6 columns for Calculation
    "Analysis", ...Array(ANALYSIS_COLUMNS.length - 1).fill(""), // N columns for Analysis
    "Remark"
  ]);

  // Second header row
  worksheet.addRow([
    "", "", "", "",
    comparisonPeriod,
    `PBMD ${comparisonPeriod}`,
    selectedPeriod,
    "Diff Amt",
    "Diff %",
    "Adj Value",
    ...ANALYSIS_COLUMNS,
    ""
  ]);

  // Merge cells for "Calculation" and "Analysis" in the first header row
  worksheet.mergeCells("E1:J1"); // Calculation spans columns E to J
  worksheet.mergeCells(`K1:${String.fromCharCode(75 + ANALYSIS_COLUMNS.length - 1)}1`); // Analysis spans columns K onward
  worksheet.mergeCells("A1:A2");
  worksheet.mergeCells("B1:B2");
  worksheet.mergeCells("C1:C2");
  worksheet.mergeCells("D1:D2");
  worksheet.mergeCells(`${String.fromCharCode(75 + ANALYSIS_COLUMNS.length)}1:${String.fromCharCode(75 + ANALYSIS_COLUMNS.length)}2`); // Remark column

  // Add your data rows here (example, you may need to adjust based on your logic)
  filteredMspData.forEach(part => {
    COST_ITEMS.forEach(costItem => {
      const costValues = calculateCostValues(part, costItem);
      const diff = calculateDiff(part, costItem, selectedPeriod, comparisonPeriod);
      const analysisValues = ANALYSIS_COLUMNS.map(col => getAnalysisValue(part, col));
      const remark = getRemarkValue(part);

      worksheet.addRow([
        part.part_no,
        part.importer,
        part.category,
        costItem,
        costValues[comparisonPeriod],
        costValues[`PBMD ${comparisonPeriod}`],
        costValues[selectedPeriod],
        diff.amount,
        diff.percent,
        costValues.adjValue,
        ...analysisValues,
        remark
      ]);
    });
  });

  // Download file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "ppr_table.xlsx";
  a.click();
  window.URL.revokeObjectURL(url);
}