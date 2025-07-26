// src/components/SkillRequests.jsx
import React, { useEffect, useState, useCallback } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  where,
  addDoc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "../styles/SkillRequests.css";

const SkillRequests = () => {
  const [requests, setRequests] = useState([]);
  const [link, setLink] = useState("");
  const [time, setTime] = useState("");
  const auth = getAuth();
  const uid = auth.currentUser?.uid;
  const navigate = useNavigate();

  const fetchRequests = useCallback(async () => {
    if (!uid) return;

    const q = query(collection(db, "requests"), where("ownerId", "==", uid));
    const snap = await getDocs(q);
    const list = [];

    for (const docSnap of snap.docs) {
      const r = { id: docSnap.id, ...docSnap.data() };
      const userDoc = await getDoc(doc(db, "users", r.requesterId));
      r.requesterName = userDoc.exists() ? userDoc.data().name || r.requesterId : r.requesterId;
      list.push(r);
    }

    setRequests(list);
  }, [uid]);

  const approveRequest = async (r) => {
    await addDoc(collection(db, "classes"), {
      skillId: r.skillId,
      requesterId: r.requesterId,
      ownerId: r.ownerId,
      time,
      link,
    });

    await updateDoc(doc(db, "requests", r.id), {
      status: "approved",
    });

    alert("Class scheduled!");
    setLink("");
    setTime("");
    fetchRequests();
  };

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      <aside className="w-64 h-screen bg-gray-900 text-white fixed top-0 left-0 shadow-lg">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-bold tracking-wide">CampusLink</h2>
        </div>
        <nav className="p-4">
          <ul className="space-y-3 text-sm">
            <li><button onClick={() => navigate("/")} className="text-red-400 hover:text-white">Logout</button></li>
          </ul>
        </nav>
      </aside>

      <main className="ml-64 p-8 w-full">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Skill Requests</h2>

        {requests.length === 0 ? (
          <p className="text-gray-500">No requests available.</p>
        ) : (
          requests.map((r) => (
            <div key={r.id} className="bg-white border-l-4 border-blue-600 p-6 shadow-md rounded-md mb-6">
              <p className="text-gray-700 mb-2"><strong>Requester:</strong> {r.requesterName}</p>
              <p className="mb-2">
                <strong>Status:</strong>{" "}
                <span className={`inline-block px-2 py-1 rounded text-sm ${
                  r.status === "approved"
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}>
                  {r.status}
                </span>
              </p>

              {r.status === "pending" && (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-3">
                    <input
                      className="border px-3 py-2 rounded-md w-full sm:w-1/3 mb-2 sm:mb-0"
                      placeholder="Class Time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                    />
                    <input
                      className="border px-3 py-2 rounded-md w-full sm:w-1/2 mb-2 sm:mb-0"
                      placeholder="Class Link"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={() => approveRequest(r)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition duration-200"
                  >
                    Approve
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </main>
    </div>
  );
};

export default SkillRequests;
