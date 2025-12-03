import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import SyncPartList from "./SyncPartList";
import PPRPage from "./PPRPage";
import PartPairingPage from "./PartPairingPage";
import PeriodComparisonPage from "./PeriodComparisonPage";
import CostMovementDetail from './CostMovementDetail';

const base = process.env.NODE_ENV === "production"
  ? "/packing-cost-fe/"
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
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);