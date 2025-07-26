import React from "react";
import "../styles/LandingPage.css";
import { Link, useNavigate } from "react-router-dom";
import { FaRobot } from "react-icons/fa"; // For chat icon

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-wrapper">
      {/* 🌐 Navbar */}
      <header className="navbar">
        <div className="logo">📘 CampusLink</div>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/announcements">Announcements</Link></li>
            <li><Link to="/documents">Documents</Link></li>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
      </header>

      {/* 🚀 Hero Section */}
      <section className="hero-section">
        <div className="hero-text">
          <h1>Stay <span>Connected</span> with CampusLink</h1>
          <p>
            A centralized platform for students and faculty to access announcements,
            documents, complaints, and more — all in one place.
          </p>
          <Link to="/register">
            <button className="hero-btn">Get Started</button>
          </Link>
        </div>

        <div className="hero-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png"
            alt="Illustration"
          />
        </div>
      </section>

      {/* ℹ️ About Section */}
      <section className="about-section">
        <h2>About CampusLink</h2>
        <p>
          CampusLink is a modern digital platform designed to bridge the gap between students and campus administration.
          From tracking hostel complaints to accessing academic documents and viewing official announcements,
          CampusLink brings everything under one smart umbrella.
        </p>
      </section>

      {/* 🌟 Feature Cards */}
      <section className="features-grid">
        <div className="feature-card">
          <h3>📢 Announcements</h3>
          <p>Stay up-to-date with all campus news, events, and alerts.</p>
        </div>
        <div className="feature-card">
          <h3>📁 Document Hub</h3>
          <p>Download syllabus, schedules, rules & regulations in one place.</p>
        </div>
        <div className="feature-card">
          <h3>🏠 Hostel Complaints</h3>
          <p>Raise, track and get updates on your hostel-related issues.</p>
        </div>
        <div className="feature-card">
          <h3>📅 Mini Timetable</h3>
          <p>Manage and visualize your class routine week by week.</p>
        </div>
        <div className="feature-card">
          <h3>🔐 Secure Login</h3>
          <p>Role-based access with Firebase authentication for safety.</p>
        </div>
        <div className="feature-card">
          <h3>🎓 Student & Faculty Portals</h3>
          <p>Dedicated dashboards with tailored features for each role.</p>
        </div>
      </section>

      {/* 📅 Academic Calendar CTA */}
      <section className="map-cta-section">
        <div className="map-cta-content">
          <h2>📅 Academic Calendar</h2>
          <p>
            Plan your semester effectively with access to the academic calendar including exam dates,
            holidays, and other key events.
          </p>
          <Link to="/academic-calendar">
            <button className="map-btn">View Academic Calendar</button>
          </Link>
        </div>
        <div className="map-cta-image">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2921/2921222.png"
            alt="Academic Calendar Illustration"
          />
        </div>
      </section>

      {/* 📎 Footer */}
      <footer className="footer">
        <p>&copy; 2025 CampusLink. Made with 💙 for student success.</p>
      </footer>

      {/* 🤖 AI Chat Floating Icon */}
      <div className="ai-chat-icon" onClick={() => navigate("/chat")}>
        <FaRobot size={24} />
      </div>
    </div>
  );
};

export default LandingPage;
