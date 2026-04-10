import React, { useState, useEffect } from "react";
import apiService from "../../services/apiService";
import "../messaging/Messaging.css"; // Correct path to Messaging.css

const ReportsPage = () => {
    const [data, setData] = useState({
        counts: { users: 0, opportunities: 0, applications: 0 },
        users: [],
        opportunities: [],
        applications: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReports = async () => {
            const token = localStorage.getItem('token');
            // Use mock data if in mock mode
            if (token === 'mock-admin-token') {
                setMockData();
                setLoading(false);
                return;
            }

            try {
                const response = await apiService.getReports();
                setData(response.data);
            } catch (err) {
                console.error("Error fetching reports, falling back to mock data:", err);
                setMockData();
            } finally {
                setLoading(false);
            }
        };

        const setMockData = () => {
            setData({
                counts: { users: 125, opportunities: 12, applications: 45 },
                users: [
                    { username: "Rahul Sharma", email: "rahul@example.com", role: "Volunteer", location: "Mumbai" },
                    { username: "Green Earth NGO", email: "contact@greenearth.org", role: "NGO", location: "Delhi" },
                    { username: "Anita Roy", email: "anita@example.com", role: "Volunteer", location: "Bangalore" },
                    { username: "Clean City Foundation", email: "info@cleancity.org", role: "NGO", location: "Pune" },
                    { username: "Vikram Singh", email: "vikram@example.com", role: "Volunteer", location: "Chennai" },
                ],
                opportunities: [
                    { title: "Beach Cleanup Drive", location: "Juhu Beach, Mumbai", date: "2023-11-15", status: "Open" },
                    { title: "Tree Plantation", location: "City Park, Delhi", date: "2023-11-20", status: "Open" },
                    { title: "Food Distribution", location: "Community Center, Pune", date: "2023-10-30", status: "Closed" },
                    { title: "River Cleaning", location: "Ganga Ghat, Varanasi", date: "2023-12-05", status: "Open" },
                ],
                applications: [
                    { volunteer: "Rahul Sharma", opportunity: "Beach Cleanup Drive", status: "accepted", appliedAt: "2023-11-01" },
                    { volunteer: "Anita Roy", opportunity: "Tree Plantation", status: "pending", appliedAt: "2023-11-02" },
                    { volunteer: "Vikram Singh", opportunity: "Beach Cleanup Drive", status: "rejected", appliedAt: "2023-11-03" },
                    { volunteer: "Rahul Sharma", opportunity: "Food Distribution", status: "accepted", appliedAt: "2023-10-25" },
                ]
            });
        };

        fetchReports();
    }, []);

    if (loading) return <div style={{ padding: 20 }}>Loading reports...</div>;
    if (error) return <div style={{ padding: 20, color: 'red' }}>{error}</div>;

    return (
        <div className="reports-container" style={{ padding: 20 }}>
            {/* SUMMARY BOXES */}
            <div className="summary-cards" style={{ display: 'flex', gap: 20, marginBottom: 30 }}>
                <div className="summary-card" style={{ flex: 1, padding: 20, background: '#e3f2fd', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: 0, color: '#1565c0' }}>Total Users</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{data.counts.users}</p>
                </div>
                <div className="summary-card" style={{ flex: 1, padding: 20, background: '#fff3e0', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: 0, color: '#e65100' }}>Total Events</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{data.counts.opportunities}</p>
                </div>
                <div className="summary-card" style={{ flex: 1, padding: 20, background: '#e8f5e9', borderRadius: 8, boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ margin: 0, color: '#2e7d32' }}>Total Applications</h3>
                    <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: '10px 0' }}>{data.counts.applications}</p>
                </div>
            </div>

            {/* USERS REPORT */}
            <h2 className="section-title">Users Report</h2>
            <div className="applications-table-container" style={{ marginBottom: 30 }}>
                <table className="app-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.users.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No users found</td></tr>
                        ) : (
                            data.users.slice(0, 10).map((user, index) => (
                                <tr key={index}>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{user.role}</td>
                                    <td>{user.location || 'N/A'}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                {data.users.length > 10 && <div style={{ textAlign: 'center', marginTop: 10, color: '#666' }}>Showing first 10 records...</div>}
            </div>

            {/* OPPORTUNITIES REPORT */}
            <h2 className="section-title">Events Report</h2>
            <div className="applications-table-container" style={{ marginBottom: 30 }}>
                <table className="app-table">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Location</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.opportunities.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No events found</td></tr>
                        ) : (
                            data.opportunities.map((opp, index) => (
                                <tr key={index}>
                                    <td>{opp.title}</td>
                                    <td>{opp.location}</td>
                                    <td>{new Date(opp.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`badge ${opp.status === 'Open' ? 'approved' : 'rejected'}`}>
                                            {opp.status}
                                        </span>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* VOLUNTEER RESPONSES */}
            <h2 className="section-title">Volunteer Participation</h2>
            <div className="applications-table-container">
                <table className="app-table">
                    <thead>
                        <tr>
                            <th>Volunteer</th>
                            <th>Event</th>
                            <th>Status</th>
                            <th>Applied Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.applications.length === 0 ? (
                            <tr><td colSpan="4" style={{ textAlign: 'center' }}>No applications found</td></tr>
                        ) : (
                            data.applications.slice(0, 20).map((app, index) => (
                                <tr key={index}>
                                    <td>{app.volunteer}</td>
                                    <td>{app.opportunity}</td>
                                    <td>
                                        <span className={`badge ${app.status === 'accepted' ? 'approved' : app.status === 'rejected' ? 'rejected' : 'pending'}`}>
                                            {app.status}
                                        </span>
                                    </td>
                                    <td>{new Date(app.appliedAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ReportsPage;
