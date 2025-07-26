import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "../styles/StudentLeaveForm.css";

const StudentLeaveForm = () => {
  const [type, setType] = useState("Leave");
  const [reason, setReason] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = getAuth().currentUser;
    if (!user) return alert("Please login");

    try {
      await addDoc(collection(db, "leave_requests"), {
        studentId: user.uid,
        type,
        reason,
        fromDate,
        toDate,
        status: "Pending",
        timestamp: Timestamp.now(),
      });
      alert("Leave / OD Request Submitted!");
      setReason("");
      setFromDate("");
      setToDate("");
      setType("Leave");
    } catch (err) {
      console.error("Error submitting request:", err);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className="student-leave-container">
      <form onSubmit={handleSubmit} className="leave-form">
        <h2>🛫 Leave / On Duty Request Form</h2>

        <label htmlFor="type">Type</label>
        <select id="type" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Leave">Leave</option>
          <option value="OD">OD</option>
        </select>

        <label htmlFor="reason">Reason</label>
        <textarea
          id="reason"
          placeholder="Enter the reason for leave/OD"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          required
        />

        <label htmlFor="from">From Date</label>
        <input
          type="date"
          id="from"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
          required
        />

        <label htmlFor="to">To Date</label>
        <input
          type="date"
          id="to"
          value={toDate}
          onChange={(e) => setToDate(e.target.value)}
          required
        />

        <button type="submit" className="submit-btn">Submit Request</button>
      </form>
    </div>
  );
};

export default StudentLeaveForm;
