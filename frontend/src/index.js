import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.css';
import './HasibDataScience.css';
import HomePage from './HomePage';
import DatabasePage from './DatabasePage';
import HasibDataScience from './HasibDataScience';

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
  <React.StrictMode>
    <BrowserRouter basename="/Archery_Database"> {/* ✅ Add this line */}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/hasib-data-analysis" element={<HasibDataScience />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);


