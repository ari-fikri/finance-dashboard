export const parseCurrency = (value) => {
  if (value === null || value === undefined) {
    return 0;
  }
  if (typeof value === "number") {
    return value;
  }
  if (typeof value === "string") {
    if (value.trim() === "") {
      return 0;
    }
    return parseFloat(value.replace(/,/g, "")) || 0;
  }
  return 0;
};

export const formatNumber = (v) => {
  if (v == null || v === "") return "-";
  if (typeof v === "number")
    return v.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  return v;
};

export const formatPercentage = (v) => {
  if (v == null || v === "") return "-";
  if (typeof v === "number") {
    const formatted = v.toFixed(2);
    return v >= 0 ? `+${formatted}%` : `${formatted}%`;
  }
  return v;
};

export const calculatePercentageDiff = (current, previous) => {
  if (current == null || previous == null || previous === 0) return null;
  const currentNum =
    typeof current === "string" ? parseFloat(current.replace(/,/g, '')) : current;
  const prevNum = typeof previous === "string" ? parseFloat(previous.replace(/,/g, '')) : previous;
  if (isNaN(currentNum) || isNaN(prevNum) || prevNum === 0) return null;
  return ((currentNum - prevNum) / prevNum) * 100;
};