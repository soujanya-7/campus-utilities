import React, { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/config";
import "../styles/AnnouncementsFeed.css";

const AnnouncementsFeed = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const q = query(
      collection(db, "announcements"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  const filteredAnnouncements = filter === "All"
    ? announcements
    : announcements.filter((a) => a.category === filter);

  return (
    <div className="feed-container">
      <h2>Campus Announcements</h2>

      <div className="filter-bar">
        <label>Filter:</label>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="All">All</option>
          <option value="Event">Event</option>
          <option value="Exam">Exam</option>
          <option value="Holiday">Holiday</option>
          <option value="Notice">Notice</option>
        </select>
      </div>

      {filteredAnnouncements.length === 0 ? (
        <p>No announcements yet.</p>
      ) : (
        <div className="announcement-list">
          {filteredAnnouncements.map((a) => (
            <div key={a.id} className="announcement-card">
              <h3>{a.title}</h3>
              <p>{a.content}</p>
              <div className="meta">
                <span className="badge">{a.category}</span>
                <span className="timestamp">
                  {a.timestamp?.toDate().toLocaleString()}
                </span>
                <span className="postedBy">Posted by: {a.postedBy}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsFeed;
