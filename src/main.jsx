import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import SyncPartList from "./SyncPartList";
import PPRPage from "./PPRPage";
import PartPairingPage from "./PartPairingPage";
import PeriodComparisonPage from "./PeriodComparisonPage";

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sync" element={<SyncPartList />} />
        <Route path="/ppr" element={<PPRPage />} />
        <Route path="/part-pairing" element={<PartPairingPage />} />
        <Route path="/period-comparison" element={<PeriodComparisonPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);