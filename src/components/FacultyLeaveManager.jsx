import React, { useState, useEffect, useCallback } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase/config";

const FacultyLeaveManager = () => {
  const [requests, setRequests] = useState([]);
  const [sortOrder, setSortOrder] = useState("desc"); // default: latest first

  const fetchData = useCallback(async () => {
    const q = query(
      collection(db, "leave_requests"),
      orderBy("timestamp", sortOrder)
    );
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setRequests(data);
  }, [sortOrder]);

  const updateStatus = async (id, newStatus) => {
    await updateDoc(doc(db, "leave_requests", id), { status: newStatus });
    fetchData();
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Leave & OD Requests</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Sort by date:</label>
        <select
          value={sortOrder}
          onChange={handleSortChange}
          className="p-1 border rounded"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>
      </div>

      {requests.length === 0 ? (
        <p>No leave or OD requests found.</p>
      ) : (
        requests.map((req) => (
          <div
            key={req.id}
            className="border rounded p-4 mb-4 shadow-md bg-white"
          >
            <p><strong>Name:</strong> {req.name}</p>
            <p><strong>Type:</strong> {req.type}</p>
            <p><strong>From:</strong> {req.fromDate}</p>
            <p><strong>To:</strong> {req.toDate}</p>
            <p><strong>Reason:</strong> {req.reason}</p>
            <p><strong>Status:</strong> <span className={`font-semibold ${req.status === "Approved" ? "text-green-600" : req.status === "Rejected" ? "text-red-600" : "text-yellow-600"}`}>{req.status}</span></p>

            {req.status === "Pending" && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => updateStatus(req.id, "Approved")}
                  className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(req.id, "Rejected")}
                  className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default FacultyLeaveManager;