import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label
} from 'recharts';
import './HasibDataScience.css';

function HasibDataScience() {
  const [equipmentData, setEquipmentData] = useState([]);
  const [topArchers, setTopArchers] = useState([]);
  const [endScores, setEndScores] = useState([]);

  useEffect(() => {
    fetch('data/equipment_score.json').then(res => res.json()).then(setEquipmentData);
    fetch('data/top_archers.json').then(res => res.json()).then(setTopArchers);
    fetch('data/end_score.json').then(res => res.json()).then(setEndScores);
  }, []);

  const endScoreHistogram = (() => {
    const bucketSize = 5;
    const buckets = {};
    endScores.forEach(({ endScore }) => {
      const bucket = `${Math.floor(endScore / bucketSize) * bucketSize}-${Math.floor(endScore / bucketSize) * bucketSize + bucketSize - 1}`;
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    });
    return Object.entries(buckets).map(([range, count]) => ({ range, count }));
  })();

  return (
    <div className="data-analysis-page">
      <h1>🏹 Hasib's Archery Data Insights</h1>
      <p>Real-time static analysis from SQL export (Python ➜ JSON ➜ React)</p>

      {/* 🎯 Equipment Analysis */}
      <div className="analysis-section">
        <h2>🎯 Equipment Performance (Avg Score)</h2>
        <ResponsiveContainer width="100%" height={320}>
  <BarChart data={equipmentData} margin={{ top: 10, right: 30, left: 20, bottom: 80 }}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis
      dataKey="equipmentName"
      angle={-45}
      textAnchor="end"
      interval={0}
    >
      <Label value="Equipment Type" offset={-65} position="insideBottom" />
    </XAxis>
    <YAxis label={{ value: 'Avg Score', angle: -90, position: 'insideLeft' }} />
    <Tooltip />
    <Legend />
    <Bar dataKey="avgScore" fill="#8884d8" />
  </BarChart>
</ResponsiveContainer>


        {/* Data Table */}
        <table>
          <thead>
            <tr>
              <th>Equipment</th>
              <th>Average Score</th>
              <th>Sessions</th>
            </tr>
          </thead>
          <tbody>
            {equipmentData.map((row, i) => (
              <tr key={i}>
                <td>{row.equipmentName}</td>
                <td>{parseFloat(row.avgScore).toFixed(2)}</td>
                <td>{row.nSessions}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 🏆 Top Archers */}
      <div className="analysis-section">
        <h2>🏆 Top 10 Archers (Personal Best)</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topArchers} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={(d) => `${d.firstName} ${d.lastName}`} angle={-25} textAnchor="end" interval={0}>
              <Label value="Archer" offset={-45} position="insideBottom" />
            </XAxis>
            <YAxis label={{ value: 'Personal Best', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="personalBest" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>

        {/* Data Table */}
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Personal Best</th>
            </tr>
          </thead>
          <tbody>
            {topArchers.map((archer, i) => (
              <tr key={i}>
                <td>{archer.firstName}</td>
                <td>{archer.lastName}</td>
                <td>{archer.personalBest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 📊 End Score Distribution */}
      <div className="analysis-section">
        <h2>📊 End Score Histogram</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={endScoreHistogram} margin={{ top: 10, right: 30, left: 0, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" angle={-25} textAnchor="end">
              <Label value="End Score Range" offset={-45} position="insideBottom" />
            </XAxis>
            <YAxis label={{ value: 'Count', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Bar dataKey="count" fill="#ffc658" />
          </BarChart>
        </ResponsiveContainer>

        {/* Data Table */}
        <table>
          <thead>
            <tr>
              <th>Score Range</th>
              <th>Frequency</th>
            </tr>
          </thead>
          <tbody>
            {endScoreHistogram.map((bucket, i) => (
              <tr key={i}>
                <td>{bucket.range}</td>
                <td>{bucket.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default HasibDataScience;
