// src/components/RoleSelect.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RoleSelect.css";

const RoleSelect = () => {
  const navigate = useNavigate();

  const handleRoleSelection = (role) => {
    if (role === "student") {
      navigate("/register/student");
    } else if (role === "faculty") {
      navigate("/register/faculty");
    }
  };

  return (
    <div className="role-select-container">
      <h2>Join CampusLink</h2>
      <p>Select your role to continue registration:</p>
      <div className="buttons">
        <button onClick={() => handleRoleSelection("student")}>I'm a Student</button>
        <button onClick={() => handleRoleSelection("faculty")}>I'm a Faculty</button>
      </div>
    </div>
  );
};

export default RoleSelect;
