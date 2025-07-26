// src/components/PollVote.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../styles/Poll.css";

const PollVote = () => {
  const [polls, setPolls] = useState([]);

  const fetchPolls = async () => {
    const snap = await getDocs(collection(db, "polls"));
    const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPolls(list.filter(p => !p.closed));
  };

  const vote = async (poll, index) => {
    const updatedVotes = [...poll.votes];
    updatedVotes[index] += 1;
    await updateDoc(doc(db, "polls", poll.id), { votes: updatedVotes });
    fetchPolls();
    alert("Thanks for voting!");
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  return (
    <div className="poll-container">
      <h2>Active Polls</h2>
      {polls.length === 0 ? (
        <p>No active polls available.</p>
      ) : (
        polls.map((poll) => (
          <div key={poll.id} className="poll-card">
            <h3>{poll.question}</h3>
            {poll.options.map((opt, idx) => (
              <button
                key={idx}
                className="vote-btn"
                onClick={() => vote(poll, idx)}
              >
                {opt}
              </button>
            ))}
          </div>
        ))
      )}
    </div>
  );
};

export default PollVote;
