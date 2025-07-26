// src/components/Register.jsx
import React, { useState } from "react";
import { auth, db } from "../firebase/config";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Register.css";

const Register = ({ role }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    year: "",
    department: "",
    designation: "",
  });

  const navigate = useNavigate();

  const generateLoginID = () => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    if (role === "student") {
      return `STU_${formData.department}_${formData.year}_${randomNum}`;
    } else {
      return `FAC_${formData.department}_${formData.designation}_${randomNum}`;
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const loginID = generateLoginID();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const uid = userCredential.user.uid;

      await setDoc(doc(db, "users", uid), {
        uid,
        role,
        name: formData.name,
        email: formData.email,
        department: formData.department,
        year: role === "student" ? formData.year : "",
        designation: role === "faculty" ? formData.designation : "",
        loginID,
      });

      alert(`✅ Registered successfully!\nYour Login ID: ${loginID}`);
      navigate(`/dashboard/${role}`);
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  return (
    <div className="register-container">
      <h2>{role === "student" ? "Student Registration" : "Faculty Registration"}</h2>

      <form onSubmit={handleRegister}>
        <input
          name="name"
          type="text"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          type="text"
          placeholder="Department (e.g. CSE)"
          value={formData.department}
          onChange={handleChange}
          required
        />

        {role === "student" && (
          <input
            name="year"
            type="text"
            placeholder="Year (1/2/3/4)"
            value={formData.year}
            onChange={handleChange}
            required
          />
        )}

        {role === "faculty" && (
          <input
            name="designation"
            type="text"
            placeholder="Designation (e.g. AsstProf)"
            value={formData.designation}
            onChange={handleChange}
            required
          />
        )}

        <button type="submit">Register</button>
      </form>

      <p className="login-link">
        Already have an account? <Link to="/login">Login here</Link>
      </p>
    </div>
  );
};

export default Register;
