import React from "react";
import { useNavigate } from "react-router-dom";
import homepageImage from "./images/homepage.jpeg";
import "./HomePage.css";

function HomePage() {
  const navigate = useNavigate();

  return (
<div className="homepage">
  <h1>Welcome to the Archery Project</h1>
{/* 🔍 Summary Box */}
<div className="summary-box">
        <p>
          <strong>Hasib's Archery Data Insights</strong> is a full-stack project that analyzes real-world archery data from a MySQL database. Using <strong>Python</strong> and <strong>SQLAlchemy</strong>, Hasib extracted insights like average scores by equipment and top archers, then exported the results as JSON.
        </p>
        <p>
          The frontend, built in <strong>React.js</strong> with <strong>Recharts</strong>, visualizes this data through interactive charts and clean UI. This modular pipeline—from SQL ➜ Python ➜ JSON ➜ React—highlights Hasib’s strong understanding of data science, analysis, and full-stack integration.
        </p>
      </div>

  <div className="button-row">
    <button onClick={() => navigate("/database")}>Database</button>
    <button onClick={() => navigate("/hasib-data-analysis")}>Hasib's Data Analysis</button>
  </div>
</div>

  );
}

export default HomePage;
