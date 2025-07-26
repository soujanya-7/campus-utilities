// src/components/SkillHistory.jsx
import React, { useEffect, useState } from "react";
import "../styles/SkillHistory.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";

const SkillHistory = () => {
  const [classes, setClasses] = useState([]);
  const [sortOrder, setSortOrder] = useState("newest");
  const [filterSkill, setFilterSkill] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const snap = await getDocs(collection(db, "classes"));
    const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setClasses(data);
  };

  const sorted = [...classes]
    .filter(c => (filterSkill ? c.skillName?.toLowerCase().includes(filterSkill.toLowerCase()) : true))
    .sort((a, b) => {
      const ta = new Date(a.time).getTime();
      const tb = new Date(b.time).getTime();
      return sortOrder === "newest" ? tb - ta : ta - tb;
    });

  return (
    <div className="skill-history-container">
      <h2>📚 Skill Session History</h2>

      <div className="filters">
        <input
          type="text"
          placeholder="Filter by skill name..."
          value={filterSkill}
          onChange={e => setFilterSkill(e.target.value)}
        />
        <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
          <option value="newest">Most Recent First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {sorted.length === 0 ? (
        <p>No sessions found.</p>
      ) : (
        <ul className="session-list">
          {sorted.map(c => (
            <li key={c.id} className={`session-item ${c.status || "scheduled"}`}>
              <div className="session-header">
                <span className="skill-name">{c.skillName || c.skillId}</span>
                <span className="session-time">{new Date(c.time).toLocaleString()}</span>
                <span className="status-badge">{c.status || "scheduled"}</span>
              </div>
              <div className="session-body">
                <span>📘 Mentor: {c.ownerId}</span> ·
                <span>🧑‍🎓 Learner: {c.requesterId}</span>
                <a href={c.link} target="_blank" rel="noreferrer" className="join-link">
                  Join Session
                </a>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SkillHistory;
