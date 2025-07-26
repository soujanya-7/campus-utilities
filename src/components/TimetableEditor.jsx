import React, { useState, useEffect, useCallback } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/config";
import "../styles/Timetable.css";

const departments = [
  "CSE", "ECE", "EEE", "MECH", "AIDS",
  "AIML", "IT", "CSBS", "CYBER SECURITY", "CCE"
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const periods = [
  "8:40-9:40", "9:40-10:40", "11:00-12:00",
  "12:00-1:00", "1:40-2:30", "2:30-3:30", "3:30-4:15"
];

const TimetableEditor = () => {
  const [department, setDepartment] = useState("CSE");
  const [timetable, setTimetable] = useState({});
  const [subjects, setSubjects] = useState([]);

  const initializeEmptyTimetable = useCallback(() => {
    const newTimetable = {};
    days.forEach((day) => {
      newTimetable[day] = Array(periods.length).fill("");
    });
    return newTimetable;
  }, []);

  const fetchSubjects = useCallback(async () => {
    const ref = doc(db, "subjectConfigs", department);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setSubjects(snap.data().subjects.map((s) => s.name));
    } else {
      setSubjects([]);
    }
  }, [department]);

  const fetchTimetable = useCallback(async () => {
    const docRef = doc(db, "timetables", department);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setTimetable(docSnap.data().timetable);
    } else {
      const generated = initializeEmptyTimetable();
      await setDoc(docRef, { department, timetable: generated });
      setTimetable(generated);
    }
  }, [department, initializeEmptyTimetable]);

  useEffect(() => {
    fetchSubjects();
    fetchTimetable();
  }, [fetchSubjects, fetchTimetable]);

  const handleChange = (day, periodIndex, value) => {
    const updated = { ...timetable };
    updated[day][periodIndex] = value;
    setTimetable(updated);
  };

  const handleSave = async () => {
    const ref = doc(db, "timetables", department);
    await setDoc(ref, { department, timetable });
    alert("Timetable saved!");
  };

  return (
    <div className="timetable-container">
      <h2 className="text-xl font-semibold mb-4">Edit Timetable</h2>
      <select
        className="mb-4 p-2 border rounded"
        value={department}
        onChange={(e) => setDepartment(e.target.value)}
      >
        {departments.map((d) => (
          <option key={d} value={d}>{d}</option>
        ))}
      </select>

      <table className="timetable-table border-collapse w-full">
        <thead>
          <tr>
            <th className="border p-2">Day / Period</th>
            {periods.map((p, i) => (
              <th key={i} className="border p-2">{p}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {days.map((day) => (
            <tr key={day}>
              <td className="border p-2 font-medium">{day}</td>
              {periods.map((_, colIdx) => (
                <td key={colIdx} className="border p-1">
                  <select
                    className="w-full p-1"
                    value={timetable[day]?.[colIdx] || ""}
                    onChange={(e) => handleChange(day, colIdx, e.target.value)}
                  >
                    <option value="">--</option>
                    {subjects.map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <button
        className="save-btn mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleSave}
      >
        Save Timetable
      </button>
    </div>
  );
};

export default TimetableEditor;