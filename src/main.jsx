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
import LoginPage from './auth/LoginPage';
import PrivateRoute from './auth/PrivateRoute';

const base = process.env.NODE_ENV === "production"
  ? "/finance-dashboard/"
  : "/";
  
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <BrowserRouter basename={base}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<PrivateRoute><App /></PrivateRoute>} />
        <Route path="/sync" element={<PrivateRoute><SyncPartList /></PrivateRoute>} />
        <Route path="/ppr" element={<PrivateRoute><PPRPage /></PrivateRoute>} />
        <Route path="/part-pairing" element={<PrivateRoute><PartPairingPage /></PrivateRoute>} />
        <Route path="/period-comparison" element={<PrivateRoute><PeriodComparisonPage /></PrivateRoute>} />
        <Route path="/cost-movement-detail/:partNo" element={<PrivateRoute><CostMovementDetail /></PrivateRoute>} />
        <Route path="/casting-material" element={<PrivateRoute><CastingMaterialPage /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);