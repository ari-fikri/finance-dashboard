import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { pprDataByPeriod } from "./data/pprSampleData";
import PPRHeader from "./components/PPR/PPRHeader";
import PPRToolbar from "./components/PPR/PPRToolbar";
import PPRTable from "./components/PPR/PPRTable";
import Pagination from "./components/Pagination";

export default function PPRPage() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState("Aug-25");
  const [remarkValues, setRemarkValues] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [partNoFilter, setPartNoFilter] = useState("");
  const [appliedPartNoFilter, setAppliedPartNoFilter] = useState("");
  const recordsPerPage = 10;
  const threshold = 10; // 10% threshold

  const [qualityGates, setQualityGates] = useState({
    rhLhFilter: false,
    plantMhRate: false,
    partNoFilter: false,
  });

  const toggleQualityGate = (gate) => {
    setQualityGates((prev) => {
      const newState = {
        rhLhFilter: false,
        plantMhRate: false,
        partNoFilter: false,
      };
      if (!prev[gate]) {
        newState[gate] = true;
      } else {
        if (gate === "partNoFilter") {
          setAppliedPartNoFilter("");
          setPartNoFilter("");
        }
      }
      return newState;
    });
  };

  const exchangeRates = {
    "Aug-25": "15,650",
    "Jul-25": "15,420",
    "Jun-25": "15,890",
  };

  const rows = useMemo(() => {
    let data = pprDataByPeriod[selectedMonth] || [];
    if (qualityGates.partNoFilter && appliedPartNoFilter) {
      data = data.filter((item) =>
        item.partNo.includes(appliedPartNoFilter)
      );
    }
    if (qualityGates.rhLhFilter) {
      data = data.filter((item) => {
        const partName = item.partName.toUpperCase();
        return partName.endsWith(" RH") || partName.endsWith(" LH");
      });
      data = data.sort((a, b) => {
        const baseName_a = a.partName
          .replace(/ (RH|LH)$/, "")
          .toUpperCase();
        const baseName_b = b.partName
          .replace(/ (RH|LH)$/, "")
          .toUpperCase();
        if (baseName_a === baseName_b) {
          return a.partName.includes("RH") ? -1 : 1;
        }
        return baseName_a.localeCompare(baseName_b);
      });
    }
    const dataWithAveragedCost = data.map((item, index, arr) => {
      const partName = item.partName.toUpperCase();
      const hasRh = partName.endsWith(" RH");
      const hasLh = partName.endsWith(" LH");
      if (hasRh || hasLh) {
        const baseName = item.partName
          .replace(/ (RH|LH)$/, "")
          .toUpperCase();
        const rhPart = arr.find(
          (p) => p.partName.toUpperCase() === `${baseName} RH`
        );
        const lhPart = arr.find(
          (p) => p.partName.toUpperCase() === `${baseName} LH`
        );
        if (rhPart && lhPart) {
          const averaged_cost = (rhPart.totalCost + lhPart.totalCost) / 2;
          return { ...item, averaged_cost };
        }
      }
      return { ...item, averaged_cost: item.totalCost };
    });
    return dataWithAveragedCost;
  }, [
    selectedMonth,
    qualityGates.rhLhFilter,
    qualityGates.partNoFilter,
    appliedPartNoFilter,
  ]);

  const totalRecords = rows.length;
  const totalPages = Math.ceil(totalRecords / recordsPerPage);
  const startIndex = (currentPage - 1) * recordsPerPage;
  const endIndex = startIndex + recordsPerPage;
  const currentRecords = rows.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const isOutsideThreshold = (diff) => {
    return Math.abs(diff) > threshold;
  };

  const shouldShowRedTriangle = (part) => {
    const partName = part.partName.toUpperCase();
    const hasRhLh = partName.includes(" RH") || partName.includes(" LH");
    const priceDiff = part.totalCost !== part.prevPeriod;
    return qualityGates.rhLhFilter && hasRhLh && priceDiff;
  };

  const getRemarkValue = (partNo, originalRemark) => {
    return remarkValues[partNo] !== undefined
      ? remarkValues[partNo]
      : originalRemark;
  };

  const handleRemarkSave = (partNo, value) => {
    setRemarkValues((prev) => ({ ...prev, [partNo]: value }));
  };

  const handleDetailClick = (part) => {
    navigate(`/cost-movement-detail/${part.partNo}`, {
      state: {
        part: part,
        currentPeriod: selectedMonth,
        comparisonPeriod: "2023-01-01", // Hardcoded for now
      },
    });
  };

  return (
    <div style={{ padding: 20 }}>
      <div style={{ maxWidth: "95vw", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 12,
          }}
        >
          <PPRHeader
            qualityGates={qualityGates}
            toggleQualityGate={toggleQualityGate}
            partNoFilter={partNoFilter}
            setPartNoFilter={setPartNoFilter}
            setAppliedPartNoFilter={setAppliedPartNoFilter}
          />
          <PPRToolbar
            selectedMonth={selectedMonth}
            setSelectedMonth={setSelectedMonth}
            setCurrentPage={setCurrentPage}
            exchangeRates={exchangeRates}
          />
        </div>

        <div style={{ height: 16 }} />

        <PPRTable
          currentRecords={currentRecords}
          startIndex={startIndex}
          isOutsideThreshold={isOutsideThreshold}
          getRemarkValue={getRemarkValue}
          handleRemarkSave={handleRemarkSave}
          handleDetailClick={handleDetailClick}
          shouldShowRedTriangle={shouldShowRedTriangle}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
          totalRecords={totalRecords}
          startIndex={startIndex}
          endIndex={endIndex}
        />
      </div>
    </div>
  );
}

/* helpers and styles */
const headerBandStyle = (bg) => ({
  background: bg,
  height: 18,
  borderTop: "3px solid rgba(0,0,0,0.08)",
});

const thSticky = {
  position: "sticky",
  top: 0,
  zIndex: 10,
  padding: "8px 10px",
  textAlign: "left",
  fontSize: 12,
  color: "#0b1220",
  fontWeight: 700,
  borderBottom: "1px solid rgba(0,0,0,0.06)"
};

const filterInputStyle = {
  width: "100%",
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.06)",
};

const filterSelectStyle = {
  padding: "6px 8px",
  borderRadius: 6,
  border: "1px solid rgba(0,0,0,0.06)",
};

const filterThStyle = {
  padding: "6px 8px",
  textAlign: "left",
  minWidth: 80
};

const td = { padding: "8px 10px", fontSize: 13, color: "#111827" };

// Background color for "Prev" data columns
const tdPrev = { ...td, backgroundColor: "#f5f5f5" };

// Helper function to get style for percentage diff based on threshold
const getTdDiffStyle = (diffValue) => {
  if (diffValue !== null && Math.abs(diffValue) > 15) {
    return { ...td, color: "red", fontWeight: "bold" };
  }
  return td;
};

const formatNumber = (v) => {
  if (v == null || v === "") return "-";
  // shows with thousand separators and 3 decimals if float
  if (typeof v === "number") return v.toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 });
  return v;
};

const formatPercentage = (v) => {
  if (v == null || v === "") return "-";
  if (typeof v === "number") {
    const formatted = v.toFixed(2);
    return v >= 0 ? `+${formatted}%` : `${formatted}%`;
  }
  return v;
};

const calculatePercentageDiff = (current, previous) => {
  if (!current || !previous || current === "" || previous === "") return null;
  const currentNum = typeof current === "string" ? parseFloat(current) : current;
  const prevNum = typeof previous === "string" ? parseFloat(previous) : previous;
  if (isNaN(currentNum) || isNaN(prevNum) || prevNum === 0) return null;
  return ((currentNum - prevNum) / prevNum) * 100;
};