// Cost item definitions
export const COST_ITEMS = [
  "Tooling OH",
  "Raw Material",
  "Total Purchase Cost",
  "Labor",
  "FOH Fix",
  "FOH Var",
  "Depre Common",
  "Depre Exclusive",
  "Total Process Cost",
  "Total Cost",
  "MH Cost",
  "Sales Volume",
  "Prod Volume"
];

// Analysis column definitions
export const ANALYSIS_COLUMNS = [
  "Volume",
  "Inflation",
  "CR",
  "Material Price Impact",
  "Gentan-I Impact",
  "Material Change"
];

// Cost item key mappings
export const COST_ITEM_KEYS = {
  "Tooling OH": "tooling_oh",
  "Raw Material": "raw_material",
  "Labor": "labor",
  "FOH Fix": "foh_fixed",
  "FOH Var": "foh_var",
  "Depre Common": "depre_common",
  "Depre Exclusive": "depre_exclusive",
  "Total Cost": "total_cost",
  "MH Cost": "mh_cost",
  "Sales Volume": "sales_volume",
  "Prod Volume": "prod_volume"
};

// Column to month key mappings
export const COLUMN_TO_MONTH_KEY = {
  'Volume': 'volume',
  'Inflation': 'inflation',
  'CR': 'CR',
  'Material Price Impact': 'material_price_impact',
  'Gentan-I Impact': 'gentan_i_impact',
  'Material Change': 'material_change'
};

// Item groupings for cost calculations
export const PURCHASE_ITEMS = ["Tooling OH", "Raw Material"];
export const PROCESS_ITEMS = ["Labor", "FOH Fix", "FOH Var", "Depre Common", "Depre Exclusive"];
