import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import "../styles/DocumentList.css";

const DocumentList = () => {
  const [documents, setDocuments] = useState([]);

  useEffect(() => {
    const fetchDocs = async () => {
      const docsSnap = await getDocs(collection(db, "documents"));
      const docs = docsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setDocuments(docs);
    };

    fetchDocs();
  }, []);

  return (
    <div className="doc-list">
      <h2>Available Documents</h2>
      {documents.length === 0 ? (
        <p>No documents available.</p>
      ) : (
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <strong>{doc.name}</strong> ({doc.type}, Sem {doc.semester}, Dept {doc.department})<br />
              <a href={doc.url} target="_blank" rel="noreferrer">Download</a> — Uploaded by {doc.uploadedBy}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DocumentList;
