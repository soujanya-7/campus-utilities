// src/pages/AcademicCalendar.jsx
import React from "react";
import "../styles/AcademicCalendar.css";

const AcademicCalendar = () => {
  return (
    <div className="calendar-page">
      <h1>📅 Academic Calendar 2025</h1>
      <p>Click the button below to view or download the full academic calendar.</p>
      
      <div className="calendar-buttons">
        <a
          href="/academic-calendar.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="calendar-btn"
        >
          View PDF
        </a>
        <a
          href="/academic-calendar.pdf"
          download
          className="calendar-btn download"
        >
          Download PDF
        </a>
      </div>

      <iframe
        src="/academic-calendar.pdf"
        width="100%"
        height="600px"
        title="Academic Calendar PDF"
        className="calendar-iframe"
      />
    </div>
  );
};

export default AcademicCalendar;
