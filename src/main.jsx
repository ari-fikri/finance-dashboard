import React from "react";
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import SyncPartList from "./SyncPartList";

createRoot(document.getElementById('root')).render(
    <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/sync" element={<SyncPartList />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
