import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "../styles/FacultyDashboard.css";

const departments = [
  "CSE", "ECE", "EEE", "MECH", "AIDS",
  "AIML", "IT", "CSBS", "CYBER SECURITY", "CCE"
];

const SubjectConfigEditor = () => {
  const [dept, setDept] = useState("CSE");
  const [subjects, setSubjects] = useState([{ name: "", periodsPerWeek: "" }]);

  useEffect(() => {
    const fetchSubjectConfig = async () => {
      try {
        const docRef = doc(db, "subjectConfigs", dept);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setSubjects(data.subjects || []);
        } else {
          setSubjects([{ name: "", periodsPerWeek: "" }]);
        }
      } catch (error) {
        console.error("Error fetching subject config:", error);
      }
    };

    fetchSubjectConfig();
  }, [dept]);

  const handleChange = (index, field, value) => {
    const updatedSubjects = subjects.map((subject, i) =>
      i === index ? { ...subject, [field]: value } : subject
    );
    setSubjects(updatedSubjects);
  };

  const addRow = () => {
    setSubjects([...subjects, { name: "", periodsPerWeek: "" }]);
  };

  const removeRow = (index) => {
    const updated = [...subjects];
    updated.splice(index, 1);
    setSubjects(updated);
  };

  const handleSave = async () => {
    try {
      await setDoc(doc(db, "subjectConfigs", dept), {
        department: dept,
        subjects,
      });
      alert("Subject configuration saved successfully.");
    } catch (error) {
      console.error("Error saving subject config:", error);
      alert("Failed to save. Check console for details.");
    }
  };

  return (
    <div className="faculty-dashboard">
      <div className="main-content">
        <h2>Configure Subjects for Department</h2>

        <select value={dept} onChange={(e) => setDept(e.target.value)}>
          {departments.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <table className="timetable-table">
          <thead>
            <tr>
              <th>Subject Name</th>
              <th>Periods/Week</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((subject, i) => (
              <tr key={i}>
                <td>
                  <input
                    type="text"
                    value={subject.name}
                    onChange={(e) => handleChange(i, "name", e.target.value)}
                    placeholder="Eg: Mathematics"
                    required
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={subject.periodsPerWeek}
                    onChange={(e) => handleChange(i, "periodsPerWeek", e.target.value)}
                    min={1}
                    max={20}
                    required
                  />
                </td>
                <td>
                  <button onClick={() => removeRow(i)}>❌</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="btn-group">
          <button type="button" onClick={addRow}>➕ Add Subject</button>
          <button onClick={handleSave} className="save-btn">💾 Save Subject Config</button>
        </div>
      </div>
    </div>
  );
};

export default SubjectConfigEditor;
