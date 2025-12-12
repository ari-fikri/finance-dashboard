import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import SyncPartList from "./SyncPartList";
import PPRPage from "./pprpage";
import PartPairingPage from "./PartPairingPage";
import PeriodComparisonPage from "./PeriodComparisonPage";
import CostMovementDetail from './CostMovementDetail';
import CastingMaterialPage from "./CastingMaterialPage";

const base = process.env.NODE_ENV === "production"
  ? "/finance-dashboard/"
  : "/";
  
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sync" element={<SyncPartList />} />
        <Route path="/ppr" element={<PPRPage />} />
        <Route path="/part-pairing" element={<PartPairingPage />} />
        <Route path="/period-comparison" element={<PeriodComparisonPage />} />
        <Route path="/cost-movement-detail/:partNo" element={<CostMovementDetail />} />
        <Route path="/casting-material" element={<CastingMaterialPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);