import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SplitCard from "./SplitCard";
import ContactForm from "../contact/ContactForm";
import ContactIllustration from "../contact/ContactIllustration";
import "./ContactPage.css";
import "../dashboard/Dashboard.css"; // Reuse dashboard styles for navbar
import VolunteerNotificationBell from "../notifications/VolunteerNotificationBell";
import NGONotificationBell from "../notifications/NGONotificationBell";
import AdminNotificationBell from "../notifications/AdminNotificationBell";

const ContactPage = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    // Match Dashboard.jsx logic: use localStorage 'userRole'
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setRole(storedRole.toLowerCase());
    } else {
      // Fallback to token if userRole not set (though LoginForm sets it)
      const token = localStorage.getItem('token');
      if (token) {
        try {
          if (token === 'mock-admin-token') {
            setRole('admin');
          } else {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setRole(payload.role);
          }
        } catch (e) {
          console.error("Invalid token", e);
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const renderNavbar = () => {
    if (!role) return null;

    if (role === 'admin') {
      return (
        <nav className="dashboard-nav">
          <div className="nav-brand">♻️ WasteZero <span className="admin-badge">ADMIN</span></div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/messages" className="nav-item">Messages</Link>
            <Link to="/profile" className="nav-item">Profile</Link>
            <span className="nav-item active">Contact</span>
            <AdminNotificationBell />
          </div>
          <div className="nav-profile">
            <a href="/" onClick={handleLogout}>Logout</a>
            <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#333' }}></div>
          </div>
        </nav>
      );
    }

    if (role === 'ngo') {
      return (
        <nav className="dashboard-nav">
          <div className="nav-brand"><span role="img" aria-label="logo">♻️</span> WasteZero</div>
          <div className="nav-links">
            <Link to="/dashboard" className="nav-item">Dashboard</Link>
            <Link to="/messages" className="nav-item">Messages</Link>
            <Link to="/profile" className="nav-item">Profile</Link>
            <span className="nav-item active">Contact</span>
            <NGONotificationBell />
          </div>
          <div className="nav-profile">
            <a href="/" onClick={handleLogout}>Logout</a>
            <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#ccc' }}></div>
          </div>
        </nav>
      );
    }

    // Default to Volunteer
    return (
      <nav className="dashboard-nav">
        <div className="nav-brand"><span role="img" aria-label="logo">♻️</span> WasteZero</div>
        <div className="nav-links">
          <Link to="/dashboard" className="nav-item">Dashboard</Link>
          <Link to="/messages" className="nav-item">Messages</Link>
          <Link to="/profile" className="nav-item">Profile</Link>
          <span className="nav-item active">Contact</span>
          <VolunteerNotificationBell />
        </div>
        <div className="nav-profile">
          <a href="/" onClick={handleLogout}>Logout</a>
          <div style={{ width: 35, height: 35, borderRadius: '50%', background: '#ccc' }}></div>
        </div>
      </nav>
    );
  };

  return (
    <div className="contact-page-wrapper">
      {renderNavbar()}
      <div className="contact-page-content">
        <div className="contact-page">
          <SplitCard
            leftContent={<ContactForm />}
            rightContent={<ContactIllustration />}
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;

