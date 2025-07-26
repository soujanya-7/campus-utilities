import React, { useState } from "react";
import { db, auth } from "../firebase/config";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "../styles/AnnouncementForm.css";

const AnnouncementForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "Event",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePost = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in.");
      return;
    }

    try {
      await addDoc(collection(db, "announcements"), {
        ...formData,
        postedBy: user.email,
        timestamp: serverTimestamp(),
      });
      alert("Announcement posted!");
      setFormData({ title: "", content: "", category: "Event" });
    } catch (err) {
      alert("Error posting announcement: " + err.message);
    }
  };

  return (
    <div className="announcement-form">
      <h2>Post New Announcement</h2>
      <form onSubmit={handlePost}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="content"
          placeholder="Announcement content"
          rows={4}
          value={formData.content}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
        >
          <option value="Event">Event</option>
          <option value="Exam">Exam</option>
          <option value="Holiday">Holiday</option>
          <option value="Notice">Notice</option>
        </select>

        <button type="submit">Post</button>
      </form>
    </div>
  );
};

export default AnnouncementForm;
