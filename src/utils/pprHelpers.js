import { useCallback } from "react";
import { COST_ITEM_KEYS, COLUMN_TO_MONTH_KEY, PURCHASE_ITEMS, PROCESS_ITEMS } from "./pprConstants";

/**
 * Hook for managing PPR data fetching and state
 */
export function usePPRData() {
  const fetchMSPData = useCallback(async () => {
    const fileUrl = `${import.meta.env.BASE_URL}msp.json`;
    try {
      const res = await fetch(fileUrl);
      const data = await res.json();
      return data.items || [];
    } catch (err) {
      console.error("Failed to load msp.json:", err);
      return [];
    }
  }, []);

  return { fetchMSPData };
}

/**
 * Get cost value for a specific part, period, and cost item
 */
export const getCostValue = (part, period, costItem) => {
  if (!part.months || !part.months[period]) return null;
  const key = COST_ITEM_KEYS[costItem];
  return part.months[period][key];
};

/**
 * Calculate percentage difference between two values
 */
export const calculateDiff = (current, previous) => {
  if (!current || !previous) return null;
  return ((current - previous) / previous) * 100;
};

/**
 * Generate cell state key for analysis data
 */
export const getCellStateKey = (partNo, costItem, column) => 
  `${partNo}:::${costItem}:::${column}`;

/**
 * Get cell value from analysis state
 */
export const getCellValueFromState = (partNo, costItem, column, analysisData) => {
  const key = getCellStateKey(partNo, costItem, column);
  return analysisData.hasOwnProperty(key) ? analysisData[key] : undefined;
};

/**
 * Get PBMD value for a cost item
 */
export const getPBMDValue = (part, costItem, analysisData) => {
  const key = COST_ITEM_KEYS[costItem];
  const stateVal = getCellValueFromState(part.part_no, costItem, "PBMD", analysisData);
  if (stateVal !== undefined) return stateVal;
  return part.months && part.months.pbmd_values ? part.months.pbmd_values[key] : "";
};

/**
 * Get Adjustment value for a cost item
 */
export const getAdjValue = (part, costItem, analysisData) => {
  const key = COST_ITEM_KEYS[costItem];
  const stateVal = getCellValueFromState(part.part_no, costItem, "Adj", analysisData);
  if (stateVal !== undefined) return stateVal;
  return part.months && part.months.adj_values ? part.months.adj_values[key] : "";
};

/**
 * Calculate total from items using a value getter function
 */
export const calculateTotal = (part, items, valueGetter) => {
  return items.reduce((sum, item) => {
    const val = parseFloat(valueGetter(part, item)) || 0;
    return sum + val;
  }, 0);
};

/**
 * Calculate PBMD total from items
 */
export const calculatePbmdTotal = (part, items, analysisData) => {
  return calculateTotal(part, items, (p, item) => getPBMDValue(p, item, analysisData));
};

/**
 * Calculate Adjustment total from items
 */
export const calculateAdjTotal = (part, items, analysisData) => {
  return calculateTotal(part, items, (p, item) => getAdjValue(p, item, analysisData));
};

/**
 * Get remark value for a part
 */
export const getRemarkValue = (part, costItem, analysisData) => {
  const stateVal = getCellValueFromState(part.part_no, costItem, "Remark", analysisData);
  if (stateVal !== undefined) return stateVal;
  return "";
};

/**
 * Get analysis default value for a cost item and column
 */
export const getAnalysisDefault = (part, costItem, column) => {
  const blockKey = COLUMN_TO_MONTH_KEY[column] || column.toLowerCase().replace(/ /g, "_");
  const costKey = COST_ITEM_KEYS[costItem];
  
  if (part.months && part.months[blockKey] && part.months[blockKey][costKey] !== undefined) {
    return part.months[blockKey][costKey];
  }
  return "";
};

/**
 * Get analysis value with state override
 */
export const getAnalysisValue = (part, costItem, column, analysisData) => {
  const stateVal = getCellValueFromState(part.part_no, costItem, column, analysisData);
  if (stateVal !== undefined) return stateVal;
  const def = getAnalysisDefault(part, costItem, column);
  return (def !== undefined && def !== null && def !== "") ? def : "";
};

/**
 * Calculate cost values for current and comparison periods
 */
export const calculateCostValues = (part, costItem, selectedPeriod, comparisonPeriod) => {
  let currentValue, previousValue;

  if (costItem === "Total Purchase Cost") {
    currentValue = (getCostValue(part, selectedPeriod, "Tooling OH") || 0) + 
                   (getCostValue(part, selectedPeriod, "Raw Material") || 0);
    previousValue = (getCostValue(part, comparisonPeriod, "Tooling OH") || 0) + 
                    (getCostValue(part, comparisonPeriod, "Raw Material") || 0);
  } else if (costItem === "Total Process Cost") {
    const processCosts = PROCESS_ITEMS.map(item => getCostValue(part, selectedPeriod, item) || 0);
    currentValue = processCosts.reduce((sum, val) => sum + val, 0);
    
    const prevProcessCosts = PROCESS_ITEMS.map(item => getCostValue(part, comparisonPeriod, item) || 0);
    previousValue = prevProcessCosts.reduce((sum, val) => sum + val, 0);
  } else if (costItem === "Total Cost") {
    const purchaseItems = PURCHASE_ITEMS.map(item => getCostValue(part, selectedPeriod, item) || 0);
    const processCosts = PROCESS_ITEMS.map(item => getCostValue(part, selectedPeriod, item) || 0);
    currentValue = purchaseItems.reduce((sum, val) => sum + val, 0) + 
                   processCosts.reduce((sum, val) => sum + val, 0);
    
    const prevPurchaseItems = PURCHASE_ITEMS.map(item => getCostValue(part, comparisonPeriod, item) || 0);
    const prevProcessCosts = PROCESS_ITEMS.map(item => getCostValue(part, comparisonPeriod, item) || 0);
    previousValue = prevPurchaseItems.reduce((sum, val) => sum + val, 0) + 
                    prevProcessCosts.reduce((sum, val) => sum + val, 0);
  } else {
    currentValue = getCostValue(part, selectedPeriod, costItem);
    previousValue = getCostValue(part, comparisonPeriod, costItem);
  }

  return { currentValue, previousValue };
};

/**
 * Get display values for PBMD and Adjustment columns
 */
export const getDisplayValues = (part, costItem, analysisData) => {
  let pbmdDisplayValue, adjDisplayValue;

  if (costItem === "Total Purchase Cost") {
    pbmdDisplayValue = calculatePbmdTotal(part, PURCHASE_ITEMS, analysisData);
    adjDisplayValue = calculateAdjTotal(part, PURCHASE_ITEMS, analysisData);
  } else if (costItem === "Total Process Cost") {
    pbmdDisplayValue = calculatePbmdTotal(part, PROCESS_ITEMS, analysisData);
    adjDisplayValue = calculateAdjTotal(part, PROCESS_ITEMS, analysisData);
  } else if (costItem === "Total Cost") {
    pbmdDisplayValue = calculatePbmdTotal(part, PURCHASE_ITEMS, analysisData) +
                       calculatePbmdTotal(part, PROCESS_ITEMS, analysisData);
    adjDisplayValue = calculateAdjTotal(part, PURCHASE_ITEMS, analysisData) +
                      calculateAdjTotal(part, PROCESS_ITEMS, analysisData);
  } else {
    pbmdDisplayValue = getPBMDValue(part, costItem, analysisData) || "";
    adjDisplayValue = getAdjValue(part, costItem, analysisData) || "";
  }

  return { pbmdDisplayValue, adjDisplayValue };
};

/**
 * Calculate analysis column total for summary rows
 */
export const calculateAnalysisColumnTotal = (part, items, column, analysisData) => {
  let total = 0;
  for (const item of items) {
    const val = getAnalysisValue(part, item, column, analysisData);
    const numVal = parseFloat(val);
    if (!isNaN(numVal)) {
      total += numVal;
    }
  }
  return total;
};

/**
 * Get analysis value for summary rows (calculates total if applicable)
 */
export const getAnalysisValueForSummaryRow = (part, costItem, column, analysisData) => {
  if (costItem === "Total Purchase Cost") {
    return calculateAnalysisColumnTotal(part, PURCHASE_ITEMS, column, analysisData);
  } else if (costItem === "Total Process Cost") {
    return calculateAnalysisColumnTotal(part, PROCESS_ITEMS, column, analysisData);
  } else if (costItem === "Total Cost") {
    const purchaseTotal = calculateAnalysisColumnTotal(part, PURCHASE_ITEMS, column, analysisData);
    const processTotal = calculateAnalysisColumnTotal(part, PROCESS_ITEMS, column, analysisData);
    return purchaseTotal + processTotal;
  }
  return getAnalysisValue(part, costItem, column, analysisData);
};