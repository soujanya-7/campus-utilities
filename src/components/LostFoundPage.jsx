// src/components/LostFoundPage.jsx
import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import { db, storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import "../styles/LostFound.css";

const LostFoundPage = () => {
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const q = query(collection(db, "lostFoundItems"), orderBy("timestamp", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description || !location || !image) {
      return alert("Please fill all fields.");
    }

    const imgRef = ref(storage, `lostfound/${uuidv4()}`);
    await uploadBytes(imgRef, image);
    const imageUrl = await getDownloadURL(imgRef);

    const docRef = await addDoc(collection(db, "lostFoundItems"), {
      description,
      location,
      imageUrl,
      status: "Lost",
      timestamp: new Date().toISOString(),
    });

    setItems((prev) => [
      { id: docRef.id, description, location, imageUrl, status: "Lost" },
      ...prev,
    ]);
    setDescription("");
    setLocation("");
    setImage(null);
  };

  const markAsFound = async (id) => {
    const itemRef = doc(db, "lostFoundItems", id);
    await updateDoc(itemRef, { status: "Found" });
    fetchItems();
  };

  return (
    <div className="lost-found-container">
      <h1>📦 Lost & Found</h1>

      <form onSubmit={handleSubmit} className="lost-form">
        <input
          type="text"
          placeholder="Item description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last seen location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <button type="submit">Report Lost Item</button>
      </form>

      <hr />

      <h2>📋 Reported Items</h2>
      {loading ? (
        <p>Loading items...</p>
      ) : items.length === 0 ? (
        <p className="empty-msg">No items reported yet.</p>
      ) : (
        <div className="item-grid">
          {items.map((item) => (
            <div key={item.id} className="lost-card">
              <img src={item.imageUrl} alt="Lost item" />
              <div className="card-details">
                <h4>{item.description}</h4>
                <p><strong>Location:</strong> {item.location}</p>
                <p><strong>Status:</strong> {item.status}</p>
                {item.status === "Lost" && (
                  <button onClick={() => markAsFound(item.id)}>
                    Mark as Found
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LostFoundPage;
