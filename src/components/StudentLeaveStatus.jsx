import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const StudentLeaveStatus = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const q = query(
        collection(db, "leave_requests"),
        where("studentId", "==", user.uid)
      );
      const snapshot = await getDocs(q);
      setRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchData();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Your Requests</h2>
      {requests.map(req => (
        <div key={req.id} className="border p-3 mb-3 rounded shadow">
          <p><strong>Type:</strong> {req.type}</p>
          <p><strong>From:</strong> {req.fromDate}</p>
          <p><strong>To:</strong> {req.toDate}</p>
          <p><strong>Status:</strong> {req.status}</p>
          <p><strong>Reason:</strong> {req.reason}</p>
        </div>
      ))}
    </div>
  );
};

export default StudentLeaveStatus;