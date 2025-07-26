// src/components/TimetableViewer.jsx
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Timetable.css";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = ["9:00-9:50", "10:00-10:50", "11:00-11:50", "12:00-12:50", "1:30-2:20", "2:30-3:20", "3:30-4:20"];

const TimetableViewer = () => {
  const [timetable, setTimetable] = useState({});
  const [department, setDepartment] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    getAuth().signOut().then(() => {
      navigate("/login");
    });
  };

  useEffect(() => {
    const fetchTimetable = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const dept = userDoc.data().department;
            setDepartment(dept);
            const ttSnap = await getDoc(doc(db, "timetables", dept));
            if (ttSnap.exists()) {
              setTimetable(ttSnap.data().timetable);
            } else {
              console.warn("No timetable found for department:", dept);
            }
          }
        } catch (error) {
          console.error("Error fetching timetable:", error);
        }
      }
    };

    fetchTimetable();
  }, []);

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Campus Utility</h2>
        <nav>
          <ul>
            <li><Link to="/student/dashboard">Dashboard</Link></li>
            <li><Link to="/skills">My Skills</Link></li>
            <li><Link to="/requests">My Requests</Link></li>
            <li><Link to="/student/timetable">Time Table</Link></li>
            <li><Link to="/student/schedule">Schedule</Link></li>
            <li><Link to="/student/announcements">Announcements</Link></li>
            <li><Link to="/lostfound">Lost Found</Link></li>
            <li
              style={{ cursor: "pointer", color: "#e74c3c" }}
              onClick={handleLogout}
              className="logout"
            >
              Logout
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="main-content timetable-viewer-container">
        <h2 className="text-xl font-semibold text-center my-4">
          {department ? `${department} Timetable` : "Loading Department..."}
        </h2>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse timetable-table">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Day / Period</th>
                {periods.map((period, i) => (
                  <th key={i} className="border px-2 py-2 text-sm">
                    {period}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day}>
                  <td className="border font-medium px-3 py-2 bg-gray-100">{day}</td>
                  {periods.map((_, index) => (
                    <td key={index} className="border px-2 py-2 text-center">
                      {timetable?.[day]?.[index] || "-"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TimetableViewer;