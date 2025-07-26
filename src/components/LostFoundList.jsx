// src/components/LostFoundList.jsx
import React, { useEffect, useState } from "react";
import { db } from "../firebase/config";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  orderBy,
  query,
} from "firebase/firestore";

const LostFoundList = () => {
  const [items, setItems] = useState([]);

  const fetchItems = async () => {
    const q = query(collection(db, "lost_found_items"), orderBy("timestamp", "desc"));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setItems(data);
  };

  const markAsFound = async (id) => {
    await updateDoc(doc(db, "lost_found_items", id), { status: "Found" });
    fetchItems();
  };

  useEffect(() => {
    fetchItems();
  }, []);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">Lost & Found History</h2>
      {items.map((item) => (
        <div key={item.id} className="border p-3 mb-3 rounded shadow">
          <img
            src={item.imageUrl}
            alt={item.description}
            className="w-32 h-32 object-cover mb-2"
          />
          <p><strong>Description:</strong> {item.description}</p>
          <p><strong>Location:</strong> {item.location}</p>
          <p><strong>Status:</strong> {item.status}</p>
          {item.status === "Lost" && (
            <button
              onClick={() => markAsFound(item.id)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded"
            >
              Mark as Found
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default LostFoundList;
