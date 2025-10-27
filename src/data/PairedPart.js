// src/data/PairedPart.js

/**
 * Paired parts data - existing part pairings in the system
 * This is the source of truth for current part pairing relationships
 */
export const pairedPartData = [
  { 
    id: 1, 
    leftPart: "51011-KK050", 
    leftPartName: "RAIL SUB-ASSY, FRAME SIDE, RH",
    rightPart: "CMD-001", 
    rightPartName: "RAIL ASSEMBLY RIGHT SIDE",
    status: "Active",
    createdDate: "2025-10-20",
    lastModified: "2025-10-22"
  },
  { 
    id: 2, 
    leftPart: "51012-KK050", 
    leftPartName: "RAIL SUB-ASSY, FRAME SIDE, LH",
    rightPart: "CMD-002", 
    rightPartName: "RAIL ASSEMBLY LEFT SIDE",
    status: "Active",
    createdDate: "2025-10-20",
    lastModified: "2025-10-22"
  },
  { 
    id: 3, 
    leftPart: "51201-KK010", 
    leftPartName: "CROSSMEMBER SUB-ASSY, FRAME, NO.1",
    rightPart: "SAP-A001", 
    rightPartName: "FRAME CROSSMEMBER TYPE A",
    status: "Active",
    createdDate: "2025-10-19",
    lastModified: "2025-10-21"
  },
  { 
    id: 4, 
    leftPart: "51205-KK010", 
    leftPartName: "AIR CLEANER ASSY",
    rightPart: "IFAST-B123", 
    rightPartName: "AIR FILTER ASSEMBLY",
    status: "Active",
    createdDate: "2025-10-18",
    lastModified: "2025-10-20"
  },
  { 
    id: 5, 
    leftPart: "51206-KK020", 
    leftPartName: "CROSSMEMBER SUB-ASSY, FRAME, NO.6",
    rightPart: "", 
    rightPartName: "",
    status: "Pending",
    createdDate: "2025-10-22",
    lastModified: "2025-10-22"
  },
  { 
    id: 6, 
    leftPart: "51230-KK060", 
    leftPartName: "CROSSMEMBER ASSY, FRAME, NO.3",
    rightPart: "", 
    rightPartName: "",
    status: "Pending",
    createdDate: "2025-10-22",
    lastModified: "2025-10-22"
  },
  { 
    id: 7, 
    leftPart: "53301-0K150", 
    leftPartName: "HOOD SUB-ASSY",
    rightPart: "CMD-007", 
    rightPartName: "HOOD ASSEMBLY",
    status: "Active",
    createdDate: "2025-10-17",
    lastModified: "2025-10-19"
  },
  { 
    id: 8, 
    leftPart: "53801-0K080", 
    leftPartName: "FENDER SUB-ASSY, FR RH",
    rightPart: "", 
    rightPartName: "",
    status: "Pending",
    createdDate: "2025-10-22",
    lastModified: "2025-10-22"
  }
];

/**
 * Helper function to find pairing by ID
 */
export const findPairingById = (id) => {
  return pairedPartData.find(pair => pair.id === id);
};

/**
 * Helper function to check if left part is already paired
 */
export const isLeftPartPaired = (partNo, excludeId = null) => {
  return pairedPartData.some(pair => pair.id !== excludeId && pair.leftPart === partNo);
};

/**
 * Helper function to check if right part is already paired
 */
export const isRightPartPaired = (partNo, excludeId = null) => {
  return pairedPartData.some(pair => pair.id !== excludeId && pair.rightPart === partNo);
};

/**
 * Helper function to get all active pairings
 */
export const getActivePairings = () => {
  return pairedPartData.filter(pair => pair.status === "Active");
};

/**
 * Helper function to get all pending pairings
 */
export const getPendingPairings = () => {
  return pairedPartData.filter(pair => pair.status === "Pending");
};

/**
 * Helper function to update a pairing (for simulation purposes)
 */
export const updatePairing = (id, updates) => {
  const index = pairedPartData.findIndex(pair => pair.id === id);
  if (index !== -1) {
    pairedPartData[index] = {
      ...pairedPartData[index],
      ...updates,
      lastModified: new Date().toISOString().split('T')[0]
    };
    return pairedPartData[index];
  }
  return null;
};

/**
 * Helper function to add new pairing (for simulation purposes)
 */
export const addNewPairing = (pairingData) => {
  const newId = Math.max(...pairedPartData.map(p => p.id)) + 1;
  const newPairing = {
    id: newId,
    ...pairingData,
    createdDate: new Date().toISOString().split('T')[0],
    lastModified: new Date().toISOString().split('T')[0]
  };
  pairedPartData.push(newPairing);
  return newPairing;
};

/**
 * Helper function to remove pairing (for simulation purposes)
 */
export const removePairing = (id) => {
  const index = pairedPartData.findIndex(pair => pair.id === id);
  if (index !== -1) {
    return pairedPartData.splice(index, 1)[0];
  }
  return null;
};