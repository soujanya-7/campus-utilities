import React, { useEffect, useState } from "react";
import "../styles/FacultyDashboard.css";
import { useNavigate } from "react-router-dom";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase/config";
import TimetableEditor from "./TimetableEditor";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const FacultyDashboard = () => {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchSkillsAndRequests();
  }, []);

  const fetchSkillsAndRequests = async () => {
    const skillsSnap = await getDocs(collection(db, "skills"));
    const requestsSnap = await getDocs(collection(db, "requests"));
    setSkills(skillsSnap.docs.map(doc => doc.data()));
    setRequests(requestsSnap.docs.map(doc => doc.data()));
  };

  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Class Average",
        data: [68, 72, 75, 80, 77, 82],
        borderColor: "#00e6e6",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="faculty-dashboard-modern">
      {/* Header */}
      <header className="faculty-header">
        <div className="profile">
          <div className="avatar">F</div>
          <div>
            <h2>soujanya123</h2>
            <p>Faculty | CampusLink</p>
          </div>
        </div>
        <button className="btn-logout" onClick={() => navigate("/")}>Logout</button>
      </header>

      {/* Dashboard Content */}
      <div className="faculty-dashboard-section">
        <div className="card-box">
          <h3>📢 Announcements</h3>
          <ul>
            <li>Internal exams from Aug 5</li>
            <li>New timetable for Sem 3 released</li>
            <li>Project review schedule updated</li>
          </ul>
          <button onClick={() => navigate("/faculty/post-announcement")}>➕ Post Announcement</button>
        </div>

        <div className="card-box">
          <h3>📈 Class Progress</h3>
          <div className="chart-container">
            <Line data={chartData} />
          </div>
        </div>

        <div className="card-box">
          <h3>📎 Upload Syllabus</h3>
          <p>Upload new subject materials and outlines</p>
          <button onClick={() => navigate("/upload-document")}>Upload</button>
        </div>

        <div className="card-box">
          <h3>🛠 Complaints</h3>
          <div className="badge">🕓 Projector issue pending</div>
          <div className="badge success">✅ Lab PCs fixed</div>
          <div className="badge info">💬 Added to new discussion</div>
          <button onClick={() => navigate("/complaints")}>View All</button>
        </div>

        <div className="card-box">
          <h3>📅 Deadlines</h3>
          <ul>
            <li>Physics Eval – <span className="due">July 28</span></li>
            <li>Report Submission – <span className="due">Aug 1</span></li>
          </ul>
        </div>

        <div className="card-box">
          <h3>✅ Create Poll</h3>
          <p>Collect feedback from students</p>
          <button onClick={() => navigate("/faculty/create-poll")}>Create Poll</button>
        </div>

        <div className="card-box">
          <h3>🗓 Timetable Editor</h3>
          <TimetableEditor />
        </div>

        <div className="card-box">
          <h3>🧠 All Posted Skills</h3>
          {skills.length === 0 ? (
            <p>No skills posted yet.</p>
          ) : (
            <ul>
              {skills.map((s, idx) => (
                <li key={idx}>📘 {s.skill} <span className="text-sm text-gray-400">(by {s.ownerId})</span></li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-box">
          <h3>📥 Skill Requests</h3>
          {requests.length === 0 ? (
            <p>No skill requests.</p>
          ) : (
            <ul>
              {requests.map((r, idx) => (
                <li key={idx}>
                  📌 Skill ID: {r.skillId} — From: {r.requesterId} — 
                  <span className={`badge status ${r.status}`}>{r.status}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-box">
          <h3>🛫 Manage Leave & OD Requests</h3>
          <p>Review and approve/reject student requests</p>
          <button onClick={() => navigate("/faculty/manage-leave")}>
            Open Leave Manager
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
