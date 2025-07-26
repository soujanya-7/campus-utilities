import React, { useState } from "react";
import { db } from "../firebase/config";
import { storage } from "../firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL
} from "firebase/storage";
import { auth } from "../firebase/config";
import "../styles/DocumentUpload.css";

const DocumentUploadForm = () => {
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    name: "",
    type: "Syllabus",
    semester: "",
    department: ""
  });

  const handleChange = (e) => {
    setMetadata({ ...metadata, [e.target.name]: e.target.value });
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Select a file first");

    const fileRef = ref(storage, `documents/${Date.now()}_${file.name}`);
    const uploadTask = uploadBytesResumable(fileRef, file);

    uploadTask.on(
      "state_changed",
      null,
      (error) => alert("Upload error: " + error.message),
      async () => {
        const url = await getDownloadURL(uploadTask.snapshot.ref);
        const user = auth.currentUser;

        await addDoc(collection(db, "documents"), {
          ...metadata,
          url,
          uploadedBy: user.email,
          uploadedAt: serverTimestamp()
        });

        alert("File uploaded successfully!");
        setFile(null);
        setMetadata({ name: "", type: "Syllabus", semester: "", department: "" });
      }
    );
  };

  return (
    <div className="doc-upload-form">
      <h2>Upload Document</h2>
      <form onSubmit={handleFileUpload}>
        <input
          type="text"
          name="name"
          placeholder="Document Title"
          value={metadata.name}
          onChange={handleChange}
          required
        />
        <select name="type" value={metadata.type} onChange={handleChange}>
          <option value="Syllabus">Syllabus</option>
          <option value="Notes">Notes</option>
          <option value="Exam Schedule">Exam Schedule</option>
          <option value="Hostel Rule">Hostel Rule</option>
        </select>
        <input
          type="text"
          name="semester"
          placeholder="Semester (e.g. 3)"
          value={metadata.semester}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="department"
          placeholder="Department (e.g. CSE)"
          value={metadata.department}
          onChange={handleChange}
          required
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default DocumentUploadForm;
