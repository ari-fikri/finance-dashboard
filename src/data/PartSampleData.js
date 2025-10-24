// src/data/PartSampleData.js

/**
 * Master part data for validation purposes
 * Contains all available parts with their details for validation against pairing entries
 */
export const partSampleData = [
  {
    partNo: "51011-KK050",
    partName: "RAIL SUB-ASSY, FRAME SIDE, RH",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "51012-KK050", 
    partName: "RAIL SUB-ASSY, FRAME SIDE, LH",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "51201-KK010",
    partName: "CROSSMEMBER SUB-ASSY, FRAME, NO.1",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "CHASSIS",
    status: "Active"
  },
  {
    partNo: "51205-KK010",
    partName: "AIR CLEANER ASSY",
    supplier: "DENSO CORPORATION",
    category: "ENGINE",
    status: "Active"
  },
  {
    partNo: "51206-KK020",
    partName: "CROSSMEMBER SUB-ASSY, FRAME, NO.6",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "CHASSIS",
    status: "Active"
  },
  {
    partNo: "51230-KK060",
    partName: "CROSSMEMBER ASSY, FRAME, NO.3",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "CHASSIS",
    status: "Active"
  },
  {
    partNo: "53301-0K150",
    partName: "HOOD SUB-ASSY",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "53801-0K080",
    partName: "FENDER SUB-ASSY, FR RH",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "53802-0K080",
    partName: "FENDER SUB-ASSY, FR LH",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "57403-KK010",
    partName: "MEMBER SUB-ASSY, FLOOR SIDE, INNER RR RH",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "57404-KK010",
    partName: "MEMBER SUB-ASSY, FLOOR SIDE, INNER RR LH",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "51204-KK070",
    partName: "CROSSMEMBER SUB-ASSY, FRAME, NO.4",
    supplier: "TOYOTA MOTOR CORPORATION",
    category: "CHASSIS",
    status: "Active"
  },
  // External system parts (CMD, SAP, IFAST)
  {
    partNo: "CMD-001",
    partName: "RAIL ASSEMBLY RIGHT SIDE",
    supplier: "CMD SYSTEM",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "CMD-002",
    partName: "RAIL ASSEMBLY LEFT SIDE",
    supplier: "CMD SYSTEM",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "CMD-007",
    partName: "HOOD ASSEMBLY",
    supplier: "CMD SYSTEM",
    category: "BODY",
    status: "Active"
  },
  {
    partNo: "SAP-A001",
    partName: "FRAME CROSSMEMBER TYPE A",
    supplier: "SAP SYSTEM",
    category: "CHASSIS",
    status: "Active"
  },
  {
    partNo: "IFAST-B123",
    partName: "AIR FILTER ASSEMBLY",
    supplier: "IFAST SYSTEM",
    category: "ENGINE",
    status: "Active"
  }
];

/**
 * Helper function to find part by part number
 */
export const findPartByNumber = (partNo) => {
  return partSampleData.find(part => part.partNo === partNo);
};

/**
 * Helper function to validate if part exists
 */
export const validatePartExists = (partNo) => {
  return partSampleData.some(part => part.partNo === partNo);
};

/**
 * Helper function to get part name by part number
 */
export const getPartNameByNumber = (partNo) => {
  const part = findPartByNumber(partNo);
  return part ? part.partName : "";
};