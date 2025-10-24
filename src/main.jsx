import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import SyncPartList from "./SyncPartList";
import PPRPage from "./PPRPage";
import PartPairingPage from "./PartPairingPage";

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sync" element={<SyncPartList />} />
        <Route path="/ppr" element={<PPRPage />} />
        <Route path="/part-pairing" element={<PartPairingPage />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
