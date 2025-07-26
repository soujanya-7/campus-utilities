// src/components/PollCreate.jsx
import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import "../styles/Poll.css";

const PollCreate = () => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleOptionChange = (index, value) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const addOption = () => {
    if (options.length < 5) setOptions([...options, ""]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "polls"), {
      question,
      options,
      votes: Array(options.length).fill(0),
      closed: false,
      createdAt: Timestamp.now(),
      createdBy: "faculty@gmail.com",
    });
    alert("Poll created!");
    setQuestion("");
    setOptions(["", ""]);
  };

  return (
    <div className="poll-container">
      <h2>Create a Poll</h2>
      <form onSubmit={handleSubmit} className="poll-form">
        <label>Question</label>
        <input
          type="text"
          placeholder="e.g. Do you prefer offline exams?"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          required
        />
        <label>Options</label>
        {options.map((opt, i) => (
          <input
            key={i}
            type="text"
            placeholder={`Option ${i + 1}`}
            value={opt}
            onChange={(e) => handleOptionChange(i, e.target.value)}
            required
          />
        ))}
        {options.length < 5 && (
          <button type="button" onClick={addOption} className="add-option-btn">
            ➕ Add Option
          </button>
        )}
        <button type="submit" className="submit-btn">Submit Poll</button>
      </form>
    </div>
  );
};

export default PollCreate;
