import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
import "../styles/FacultyDashboard.css";

const ClassHistory = () => {
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Add logout logic if needed
    navigate("/");
  };

  useEffect(() => {
    const fetch = async () => {
      const snap = await getDocs(collection(db, "classes"));
      const list = snap.docs.map((doc) => doc.data());
      setClasses(list);
    };
    fetch();
  }, []);

  return (
    <div className="faculty-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>CampusLink</h2>
        <nav>
          <ul>
            <li>
              <Link to="/dashboard/faculty">Dashboard</Link>
            </li>
            <li>
              <Link to="/faculty/post-announcement">Post Announcement</Link>
            </li>
            <li>
              <Link to="/faculty/subject-config">Subject Configuration</Link>
            </li>
            <li>
              <Link to="/history">Skill History</Link>
            </li>
            <li>
              <Link to="/lostfound">Lost & Found</Link>
            </li>
            <li>
              <Link to="/faculty/timetable">Time Table</Link>
            </li>
            <li onClick={handleLogout} style={{ cursor: "pointer", color: "red" }}>
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <h2>Skill Class History</h2>
        {classes.length === 0 ? (
          <p>No class history found.</p>
        ) : (
          classes.map((c, i) => (
            <div key={i} className="class-entry">
              <p><strong>Skill ID:</strong> {c.skillId}</p>
              <p><strong>Conducted by:</strong> {c.ownerId}</p>
              <p><strong>Attendee:</strong> {c.requesterId}</p>
              <p><strong>Time:</strong> {c.time}</p>
              <p>
                <strong>Link:</strong>{" "}
                <a href={c.link} target="_blank" rel="noopener noreferrer">
                  {c.link}
                </a>
              </p>
              <hr />
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default ClassHistory;