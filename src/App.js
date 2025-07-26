import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// 📍 Pages
import LandingPage from "./components/LandingPage";
import Login from "./components/Login";
import RoleSelect from "./components/RoleSelect";
import Register from "./components/Register";

// 🎓 Dashboards
import StudentDashboard from "./components/StudentDashboard";
import FacultyDashboard from "./components/FacultyDashboard";

// 📢 Announcements
import AnnouncementForm from "./components/AnnouncementForm";
import AnnouncementsFeed from "./components/AnnouncementsFeed";

// 📁 Documents
import DocumentUploadForm from "./components/DocumentUploadForm";
import DocumentList from "./components/DocumentList";

// 📅 Academic Calendar
import AcademicCalendar from "./components/AcademicCalendar";

// 🧳 Lost & Found
import LostFoundPage from "./components/LostFoundPage";
import LostFoundList from "./components/LostFoundList";

// 🗳 Polls & Feedback
import PollCreation from "./components/PollCreate";
import PollVoting from "./components/PollVote";

// 🧮 Subject Configuration & Timetable
import SubjectConfigEditor from "./components/SubjectConfigEditor";
import TimetableEditor from "./components/TimetableEditor";
import TimetableViewer from "./components/TimetableViewer";

// 🧠 Skills Management
import SkillBoard from "./components/SkillBoard";
import SkillRequests from "./components/SkillRequests";
import SkillHistory from "./components/SkillHistory";

// 📅 Personal Schedule
import Schedule from "./components/Schedule";

// 📌 Leave / OD Management
import StudentLeaveForm from "./components/StudentLeaveForm";
import StudentLeaveStatus from "./components/StudentLeaveStatus";
import FacultyLeaveManager from "./components/FacultyLeaveManager";

// 🤖 AI Chat
import AIChat from "./components/AIChat";

// 🌐 Styles
import "./styles/App.css";
import "./styles/Timetable.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 🌐 Public */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />

        {/* 🔄 Role Selection & Registration */}
        <Route path="/register" element={<RoleSelect />} />
        <Route path="/register/student" element={<Register role="student" />} />
        <Route path="/register/faculty" element={<Register role="faculty" />} />

        {/* 🎓 Dashboards */}
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/faculty" element={<FacultyDashboard />} />

        {/* 📢 Announcements */}
        <Route path="/faculty/post-announcement" element={<AnnouncementForm />} />
        <Route path="/announcements" element={<AnnouncementsFeed />} />

        {/* 📁 Documents */}
        <Route path="/upload-document" element={<DocumentUploadForm />} />
        <Route path="/documents" element={<DocumentList />} />

        {/* 📅 Academic Calendar */}
        <Route path="/academic-calendar" element={<AcademicCalendar />} />

        {/* 🧳 Lost & Found */}
        <Route path="/lost-found" element={<LostFoundPage />} />
        <Route path="/lost-found/history" element={<LostFoundList />} />

        {/* 🗳 Polls */}
        <Route path="/faculty/create-poll" element={<PollCreation />} />
        <Route path="/student/polls" element={<PollVoting />} />

        {/* 🧮 Subject Config & Timetable */}
        <Route path="/faculty/subject-config" element={<SubjectConfigEditor />} />
        <Route path="/faculty/timetable-editor" element={<TimetableEditor />} />
        <Route path="/student/timetable" element={<TimetableViewer />} />

        {/* 🧠 Skill Management */}
        <Route path="/skills" element={<SkillBoard />} />
        <Route path="/requests" element={<SkillRequests />} />
        <Route path="/faculty/history" element={<SkillHistory />} />

        {/* 📅 Student Weekly Planner */}
        <Route path="/student/schedule" element={<Schedule />} />

        {/* 📌 Leave / OD Management */}
        <Route path="/student/leave-request" element={<StudentLeaveForm />} />
        <Route path="/student/leave-status" element={<StudentLeaveStatus />} />
        <Route path="/faculty/manage-leave" element={<FacultyLeaveManager />} />

        {/* 🤖 AI Chat */}
        <Route path="/chat" element={<AIChat />} />

        {/* 🚫 404 Page */}
        <Route path="*" element={<p className="not-found">404: Page Not Found</p>} />
      </Routes>
    </Router>
  );
}

export default App;
