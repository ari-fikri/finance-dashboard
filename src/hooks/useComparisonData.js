import { useState } from 'react';
import { pprDataByPeriod } from '../data/pprSampleData';
import { parseCurrency } from '../utils/comparisonUtils';

export const useComparisonData = () => {
  const [rows, setRows] = useState([]);
  const [comparedMonth1, setComparedMonth1] = useState('');
  const [comparedMonth2, setComparedMonth2] = useState('');

  const handleCompare = (selectedMonth, selectedMonth2) => {
    const data1 = pprDataByPeriod[selectedMonth];
    const data2 = pprDataByPeriod[selectedMonth2];

    const comparisonData = data2.map((currentPart, index) => {
      const prevPart = data1.find((p) => p.partNo === currentPart.partNo);

      if (!prevPart) {
        return {
          ...currentPart,
          no: index + 1,
          prevPeriod: 0,
          diff: 100,
          localOHPrev: 0,
          toolingOHPrev: 0,
          rawMaterialPrev: 0,
          laborPrev: 0,
          fohFixPrev: 0,
          fohVarPrev: 0,
          unfinishDeprePrev: 0,
          fgCostPrev: 0,
          mfgCostPrev: 0,
          sellingPricePrev: 0,
          totalCostPrev: 0,
          totalProcessCost: 0,
          totalProcessCostPrev: 0,
          exclusiveInvestment: 0,
          exclusiveInvestmentPrev: 0,
        };
      }

      const labor = parseCurrency(currentPart.labor);
      const fohFix = parseCurrency(currentPart.fohFix);
      const fohVar = parseCurrency(currentPart.fohVar);
      const unfinishDepre = parseCurrency(currentPart.unfinishDepre);

      const laborPrev = parseCurrency(prevPart.labor);
      const fohFixPrev = parseCurrency(prevPart.fohFix);
      const fohVarPrev = parseCurrency(prevPart.fohVar);
      const unfinishDeprePrev = parseCurrency(prevPart.unfinishDepre);

      const localOH = parseCurrency(currentPart.localOH);
      const toolingOH = parseCurrency(currentPart.toolingOH);
      const rawMaterial = parseCurrency(currentPart.rawMaterial);

      const localOHPrev = parseCurrency(prevPart.localOH);
      const toolingOHPrev = parseCurrency(prevPart.toolingOH);
      const rawMaterialPrev = parseCurrency(prevPart.rawMaterial);

      const totalProcessCost = labor + fohFix + fohVar + unfinishDepre;
      const totalProcessCostPrev =
        laborPrev + fohFixPrev + fohVarPrev + unfinishDeprePrev;

      const totalCost = localOH + toolingOH + rawMaterial + totalProcessCost;
      const prevTotalCost =
        localOHPrev + toolingOHPrev + rawMaterialPrev + totalProcessCostPrev;

      const diff =
        prevTotalCost === 0
          ? 100
          : ((totalCost - prevTotalCost) / prevTotalCost) * 100;

      return {
        ...currentPart,
        no: index + 1,
        totalCost: totalCost,
        diff: diff,
        localOH: localOH,
        toolingOH: toolingOH,
        rawMaterial: rawMaterial,
        labor: labor,
        fohFix: fohFix,
        fohVar: fohVar,
        unfinishDepre: unfinishDepre,
        localOHPrev: localOHPrev,
        toolingOHPrev: toolingOHPrev,
        rawMaterialPrev: rawMaterialPrev,
        laborPrev: laborPrev,
        fohFixPrev: fohFixPrev,
        fohVarPrev: fohVarPrev,
        unfinishDeprePrev: unfinishDeprePrev,
        fgCostPrev: parseCurrency(prevPart.fgCost),
        mfgCostPrev: parseCurrency(prevPart.mfgCost),
        sellingPricePrev: parseCurrency(prevPart.sellingPrice),
        totalCostPrev: prevTotalCost,
        totalProcessCost: totalProcessCost,
        totalProcessCostPrev: totalProcessCostPrev,
        exclusiveInvestment: parseCurrency(currentPart.exclusiveInvestment),
        exclusiveInvestmentPrev: parseCurrency(prevPart.exclusiveInvestment),
      };
    });

    setRows(comparisonData);
    setComparedMonth1(selectedMonth);
    setComparedMonth2(selectedMonth2);
  };

  return {
    rows,
    comparedMonth1,
    comparedMonth2,
    handleCompare,
    setRows,
  };
};