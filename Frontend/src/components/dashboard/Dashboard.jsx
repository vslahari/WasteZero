import React, { useState, useEffect } from 'react';
import VolunteerDashboard from './VolunteerDashboard';
import NGODashboard from './NGODashboard';
import AdminDashboard from './AdminDashboard';

const Dashboard = () => {
    // Read role from localStorage, defaulting to volunteer
    const role = localStorage.getItem('userRole') || 'volunteer';
    const normalizedRole = role.toLowerCase(); // Convert to lowercase for comparison

    return (
        <div>
            {normalizedRole === 'volunteer' && <VolunteerDashboard />}
            {normalizedRole === 'ngo' && <NGODashboard />}
            {normalizedRole === 'admin' && <AdminDashboard />}

            {/* Debug Role Switcher - Remove in Production */}
            <div style={{ position: 'fixed', bottom: 10, right: 10, background: 'rgba(0,0,0,0.8)', padding: '10px', borderRadius: '8px', zIndex: 9999 }}>
                <p style={{ color: 'white', margin: '0 0 5px 0', fontSize: '12px' }}>Debug Role Switcher</p>
                <button onClick={() => { localStorage.setItem('userRole', 'volunteer'); window.location.reload(); }} style={{ marginRight: 5 }}>Vol</button>
                <button onClick={() => { localStorage.setItem('userRole', 'ngo'); window.location.reload(); }} style={{ marginRight: 5 }}>NGO</button>
                <button onClick={() => { localStorage.setItem('userRole', 'admin'); window.location.reload(); }}>Adm</button>
            </div>
        </div>
    );
};

export default Dashboard;
