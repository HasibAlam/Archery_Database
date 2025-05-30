import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import DatabasePage from "./DatabasePage"; // renamed your App.js page
import HasibDataScience from "./HasibDataScience";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/database" element={<DatabasePage />} />
        <Route path="/hasib-data-analysis" element={<HasibDataScience />} />
      </Routes>
    </Router>
  );
}

export default App;
