// src/components/SkillBoard.jsx
import React, { useEffect, useState, useCallback } from "react";
import { db } from "../firebase/config";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/SkillBoard.css";

const SkillBoard = () => {
  const [postedSkills, setPostedSkills] = useState([]);
  const [requestedSkills, setRequestedSkills] = useState([]);
  const [newSkill, setNewSkill] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;
  const navigate = useNavigate();

  const fetchData = useCallback(async () => {
    if (!user) return;

    const skillsSnap = await getDocs(
      query(collection(db, "skills"), where("ownerId", "==", user.uid))
    );
    setPostedSkills(skillsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

    const requestsSnap = await getDocs(
      query(collection(db, "requests"), where("requesterId", "==", user.uid))
    );

    const requestList = [];
    for (let rDoc of requestsSnap.docs) {
      const requestData = rDoc.data();
      const skillDoc = await getDoc(doc(db, "skills", requestData.skillId));
      const skillName = skillDoc.exists() ? skillDoc.data().skill : "Unknown";

      requestList.push({
        id: rDoc.id,
        ...requestData,
        skillName,
      });
    }

    setRequestedSkills(requestList);
  }, [user]);

  const postSkill = async () => {
    if (!newSkill) return;
    await addDoc(collection(db, "skills"), {
      skill: newSkill,
      ownerId: user.uid,
      timestamp: serverTimestamp(),
    });
    setNewSkill("");
    fetchData();
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6 fixed h-full">
        <h2 className="text-2xl font-bold">CampusLink</h2>
        <nav className="mt-4 space-y-2 text-sm">
          <button onClick={() => navigate("/home")} className="block w-full text-left hover:text-yellow-400">🏠 Home</button>
          <button onClick={() => navigate("/skills")} className="block w-full text-left hover:text-yellow-400">🧠 Skill Board</button>
          <button onClick={() => navigate("/skill-requests")} className="block w-full text-left hover:text-yellow-400">📩 Skill Requests</button>
          <button onClick={handleLogout} className="block w-full text-left text-red-400 hover:text-white">🚪 Logout</button>
        </nav>
      </aside>

      <main className="ml-64 p-8 w-full">
        <h2 className="text-3xl font-bold mb-6">Skill Board</h2>

        <div className="mb-8">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a new skill to teach..."
            className="border border-gray-300 rounded px-4 py-2 mr-2 w-64"
          />
          <button
            onClick={postSkill}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Post Skill
          </button>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-semibold mb-3">🧠 Skills You Posted</h3>
          {postedSkills.length === 0 ? (
            <p className="text-gray-500">You haven't posted any skills yet.</p>
          ) : (
            <ul className="space-y-4">
              {postedSkills.map((s) => (
                <li key={s.id} className="bg-white shadow p-4 rounded">
                  <strong>{s.skill}</strong> <span className="text-sm text-gray-500">(ID: {s.id})</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">📩 Skills You Requested</h3>
          {requestedSkills.length === 0 ? (
            <p className="text-gray-500">You haven’t requested any skills yet.</p>
          ) : (
            <ul className="space-y-4">
              {requestedSkills.map((r) => (
                <li key={r.id} className="bg-white shadow p-4 rounded flex justify-between items-center">
                  <div>
                    <strong>{r.skillName}</strong>
                    <span className="ml-2 text-sm text-gray-600">(To: {r.ownerId})</span>
                  </div>
                  <span className={`text-sm font-medium px-2 py-1 rounded ${
                    r.status === "approved"
                      ? "bg-green-100 text-green-600"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {r.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
};

export default SkillBoard;
