// src/data/pprSampleData.js

export const pprSampleData = [
  {
    no: 1,
    partNo: "51011-KK050",
    partName: "RAIL SUB-ASSY, FRAME SIDE, RH",
    jsp: "", 
    msp: "", 
    localOH: "", 
    toolingOH: 333.082,
    rawMaterial: 82,
    labor: 784.238, 
    fohFix: 214.761, 
    fohVar: 120.351, 
    unfinishDepre: 41.853,
    totalProcessCost: 94.069, 
    exclusiveInvestment: 27.474, 
    prevPeriod: 1373.273, // -15% from totalCost
    totalCost: 1615.909,
    diff: 17.66, // percentage difference
    remark: "RH - LH different",
  },
  {
    no: 2,
    partNo: "51012-KK050",
    partName: "RAIL SUB-ASSY, FRAME SIDE, LH",
    jsp: "", 
    msp: "", 
    localOH: "", 
    toolingOH: 342.265,
    rawMaterial: 567,
    labor: 784.238, 
    fohFix: 213.569, 
    fohVar: 120.351, 
    unfinishDepre: 41.853,
    totalProcessCost: 94.069, 
    exclusiveInvestment: 27.474, 
    prevPeriod: 1900.530, // +17% from totalCost
    totalCost: 1624.385,
    diff: -14.53, // percentage difference
    remark: "",
  },
  // add more rows as needed...
];