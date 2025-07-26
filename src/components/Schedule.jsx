import React, { useState, useEffect } from "react";
import { db } from "../firebase/config";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/Schedule.css";
import { Link, useNavigate } from "react-router-dom";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const Schedule = () => {
  const [tasks, setTasks] = useState({});
  const [docId, setDocId] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSchedule = async () => {
      if (!user) return;
      const q = query(collection(db, "weeklySchedule"), where("userId", "==", user.uid));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        setDocId(doc.id);
        setTasks(doc.data().tasks || {});
      }
    };

    fetchSchedule();
  }, [user]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate("/"); // Redirect to home or login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleTaskChange = (day, index, field, value) => {
    const updatedTasks = { ...tasks };
    if (!updatedTasks[day]) updatedTasks[day] = [];
    updatedTasks[day][index][field] = value;
    setTasks(updatedTasks);
  };

  const addTask = (day) => {
    const updatedTasks = { ...tasks };
    if (!updatedTasks[day]) updatedTasks[day] = [];
    updatedTasks[day].push({ time: "", task: "" });
    setTasks(updatedTasks);
  };

  const removeTask = (day, index) => {
    const updatedTasks = { ...tasks };
    updatedTasks[day].splice(index, 1);
    setTasks(updatedTasks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    const payload = { tasks, userId: user.uid };

    try {
      if (docId) {
        await updateDoc(doc(db, "weeklySchedule", docId), payload);
        alert("Schedule updated!");
      } else {
        const newDoc = await addDoc(collection(db, "weeklySchedule"), payload);
        setDocId(newDoc.id);
        alert("Schedule saved!");
      }
    } catch (err) {
      console.error("Error saving schedule:", err);
    }
  };

  const handleDelete = async () => {
    if (!docId) return alert("No schedule to delete");
    if (!window.confirm("Delete your entire schedule?")) return;

    try {
      await deleteDoc(doc(db, "weeklySchedule", docId));
      setTasks({});
      setDocId(null);
      alert("Schedule deleted.");
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Campus Utility</h2>
        <nav>
          <ul>
            <li>
              <Link to="/student/dashboard">Dashboard</Link>
            </li>
            <li>
              <Link to="/skills">My Skills</Link>
            </li>
            <li>
              <Link to="/requests">My Requests</Link>
            </li>
            <li>
              <Link to="/student/timetable">Time Table</Link>
            </li>
            <li>
              <Link to="/student/schedule">Schedule</Link>
            </li>
            <li>
              <Link to="/student/announcements">Announcements</Link>
            </li>
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

      {/* Main content */}
      <div className="schedule-container">
        <h2>📅 Weekly Calendar</h2>
        <form onSubmit={handleSubmit}>
          <div className="calendar">
            {daysOfWeek.map((day) => (
              <div className="calendar-day" key={day}>
                <h3>{day}</h3>
                {(tasks[day] || []).map((entry, index) => (
                  <div className="task-row" key={index}>
                    <input
                      type="time"
                      value={entry.time}
                      onChange={(e) => handleTaskChange(day, index, "time", e.target.value)}
                    />
                    <input
                      type="text"
                      value={entry.task}
                      placeholder="Task description"
                      onChange={(e) => handleTaskChange(day, index, "task", e.target.value)}
                    />
                    <button type="button" onClick={() => removeTask(day, index)}>❌</button>
                  </div>
                ))}
                <button type="button" onClick={() => addTask(day)} className="add-task-btn">
                  ➕ Add Task
                </button>
              </div>
            ))}
          </div>

          <div className="btn-actions">
            <button type="submit" className="submit-btn">
              {docId ? "Update Schedule" : "Save Schedule"}
            </button>
            {docId && (
              <button type="button" onClick={handleDelete} className="delete-btn">
                Delete Schedule
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Schedule;