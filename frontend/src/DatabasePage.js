import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import image1 from "./images/image1.png";
import image2 from "./images/image2.png";
import image3 from "./images/image3.png";

function DatabasePage() {
  const [tables, setTables] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [tableColumns, setTableColumns] = useState([]);
  const [selectedTable, setSelectedTable] = useState("");
  const [error, setError] = useState("");
  const [backgroundImage, setBackgroundImage] = useState(image1);

  const images = [image1, image2, image3];

  useEffect(() => {
    // ✅ Call your local FastAPI backend to get table names
    axios.get("http://localhost:8000/tables")
      .then(response => setTables(response.data.tables))
      .catch(error => setError("Error fetching tables: " + error.message));

    // ✅ Background image loop
    const interval = setInterval(() => {
      setBackgroundImage((prevImage) => {
        const currentIndex = images.indexOf(prevImage);
        const nextIndex = (currentIndex + 1) % images.length;
        return images[nextIndex];
      });
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    document.body.style.backgroundImage = `url(${backgroundImage})`;
  }, [backgroundImage]);

  const fetchTableData = (tableName) => {
    axios
      .get(`http://localhost:8000/table/${tableName}`)
      .then((response) => {
        setTableColumns(response.data.columns || []);
        setTableData(response.data.data || []);
        setError("");
      })
      .catch((error) => setError("Error fetching table data: " + error.message));
  };

  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
    fetchTableData(tableName);
  };

  return (
    <div className="App">
      <div className="header">Archery Database Viewer</div>

      {error && <p className="error-message">{error}</p>}

      <div className="table-list">
        <h3>Tables:</h3>
        {tables.length > 0 ? (
          tables.map((table) => (
            <button key={table} onClick={() => handleTableClick(table)}>
              {table}
            </button>
          ))
        ) : (
          <p>No tables found. Please check your database connection.</p>
        )}
      </div>

      <hr />

      {selectedTable && (
        <div>
          <h3>Data from {selectedTable}</h3>
          <table className="data-table">
            <thead>
              <tr>
                {tableColumns.map((column) => (
                  <th key={column}>{column}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr key={index}>
                    {tableColumns.map((col) => (
                      <td key={col}>{row[col] ?? "-"}</td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={tableColumns.length}>
                    No data available in this table.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default DatabasePage;
