import React, { useState, useEffect } from "react";
import "../styles/StudentDashboard.css";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
} from "chart.js";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import TimetableViewer from "./TimetableViewer";
import Schedule from "./Schedule";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip);

const StudentDashboard = () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) setUserEmail(user.email.split("@")[0]);
    });
    return () => unsubscribe();
  }, [auth]);

  const chartData = {
    labels: ["Quiz 1", "Quiz 2", "Midsem", "Quiz 3", "Endsem"],
    datasets: [
      {
        label: "Your Grades (%)",
        data: [65, 72, 78, 80, 85],
        fill: false,
        borderColor: "#66e0ff",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="student-dashboard-vertical">
      {/* Header */}
      <header className="student-header">
        <h1 className="logo">CampusLink</h1>
        <div className="profile">
          <div className="avatar">{userEmail.charAt(0).toUpperCase()}</div>
          <div>
            <h2>{userEmail}</h2>
            <p>Student</p>
          </div>
        </div>
        <button
          className="btn-logout"
          onClick={() => {
            signOut(auth);
            navigate("/login");
          }}
        >
          Logout
        </button>
      </header>

      {/* Tab Navigation */}
      <div className="dashboard-tabs">
        <button
          onClick={() => setActiveTab("overview")}
          className={activeTab === "overview" ? "active" : ""}
        >
          Dashboard
        </button>
        <button
          onClick={() => setActiveTab("planner")}
          className={activeTab === "planner" ? "active" : ""}
        >
          Planner
        </button>
      </div>

      {/* Content */}
      <div className="dashboard-section">
        {activeTab === "overview" && (
          <>
            <div className="card-box">
              <h3>📚 Academic Overview</h3>
              <div className="overview-row">
                <div className="overview-card">Upcoming Assignments: <strong>3</strong></div>
                <div className="overview-card">Grades Released: <strong>4</strong></div>
                <div className="overview-card">Enrolled Courses: <strong>5</strong></div>
              </div>
            </div>

            <div className="card-box">
              <h4>📢 Latest Notices</h4>
              <ul>
                <li>Internal exams from Aug 5</li>
                <li>Sem 4 timetable published</li>
                <li>New exam guidelines uploaded</li>
              </ul>
            </div>

            <div className="card-box">
              <h4>📊 Progress Chart</h4>
              <div className="chart-container">
                <Line data={chartData} />
              </div>
            </div>

            <div className="card-box">
              <h4>📝 Assignment Alerts</h4>
              <ul>
                <li>DBMS Lab report - Due July 28</li>
                <li>ML mini project - Due Aug 2</li>
                <li>CN assignment - Due Aug 5</li>
              </ul>
              <button onClick={() => navigate("/student/assignments")}>View All</button>
            </div>

            <div className="card-box">
              <h4>📅 Deadlines</h4>
              <ul>
                <li>Project review on Aug 10</li>
                <li>Quiz 4 on Aug 15</li>
              </ul>
            </div>

            <div className="card-box">
              <h4>✅ Polls & Feedback</h4>
              <p>Participate in polls and give feedback on campus events.</p>
              <button onClick={() => navigate("/student/polls")}>Vote Now</button>
            </div>

            <div className="card-box timetable-card">
              <h4>🗓 Your Timetable</h4>
              <div className="timetable-dashboard-wrapper">
                <TimetableViewer />
              </div>
            </div>

            <div className="card-box">
              <h4>🛫 Leave / On Duty Request</h4>
              <p>Apply for leave or OD and track status</p>
              <div className="od-buttons">
                <button className="od-btn" onClick={() => navigate("/student/leave-request")}>Submit Request</button>
                <button className="od-btn view" onClick={() => navigate("/student/leave-status")}>View Status</button>
              </div>
            </div>
          </>
        )}

        {activeTab === "planner" && (
          <div className="planner-wrapper">
            <Schedule />
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
