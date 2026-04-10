import React, { useState, useEffect, useRef } from 'react';
import apiService from '../../services/apiService';
import { Link } from 'react-router-dom';
import '../layout/RegisterPage.css'; // Reuse RegisterPage layout styles
import '../auth/RegisterForm.css';   // Reuse Form styles

// Assets
import Character from '../../assets/Character.svg';
import TopLeftPlant from '../../assets/Top left plant.svg';
import RightSideLeaf from '../../assets/Right side leaf.svg';
import BottomRightPlant from '../../assets/Bottom right.svg';

// Icons
import { FaUser, FaMapMarkerAlt, FaPhone, FaAddressCard } from 'react-icons/fa';

const volunteerSkills = [
    "Teaching",
    "Event Planning",
    "Community Outreach",
    "Fundraising",
    "Healthcare Support",
    "Environmental Conservation",
    "Youth Mentoring",
    "Administrative Support",
    "Social Media Management",
    "Technical Support"
];

const UserProfile = () => {
    const [profile, setProfile] = useState({
        name: '',
        location: '',
        bio: '',
        contact: '', // This maps to 'mobile' in backend
        skills: [],
        availability: '',
        role: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [showSkills, setShowSkills] = useState(false);
    const skillsRef = useRef(null);

    useEffect(() => {
        fetchProfile();
    }, []);

    useEffect(() => {
        function handleClickOutside(event) {
            if (skillsRef.current && !skillsRef.current.contains(event.target)) {
                setShowSkills(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchProfile = async () => {
        try {
            const response = await apiService.getProfile();
            const data = response.data;
            setProfile({
                name: data.username || '',
                location: data.location || '',
                bio: data.bio || '',
                contact: data.mobile || '',
                skills: data.skills || [],
                availability: data.availability || '',
                role: data.role || ''
            });
        } catch (error) {
            console.error("Error fetching profile", error);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await apiService.updateProfile(profile);
            setIsEditing(false);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error updating profile", error);
            setMessage('Failed to update profile.');
        }
    };

    return (
        <div className="register-page-container">
            {/* Background/Decor Assets */}
            <img src={TopLeftPlant} alt="" className="decor-top-left" />
            <img src={RightSideLeaf} alt="" className="decor-right-side" />

            <div className="register-content-wrapper">
                <img src={Character} alt="Character" className="decor-character" />

                {/* Reuse Register Card Panel */}
                <div className="register-card-panel" style={{ minHeight: 'auto' }}>

                    <div className="register-container">
                        <div className="register-header">
                            <h2 className="register-title">My Profile</h2>
                            <p style={{ color: '#666', fontSize: '0.9rem' }}>Manage your personal details</p>
                        </div>

                        {message && <div className="error-message" style={{ backgroundColor: '#e8f5e9', color: '#2e7d32', borderColor: '#c8e6c9' }}>{message}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Name Field */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaUser className="input-icon" />
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-input has-icon"
                                        placeholder="Full Name"
                                        value={profile.name}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Location Field (Replaced Email) */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaMapMarkerAlt className="input-icon" />
                                    <input
                                        type="text"
                                        name="location"
                                        className="form-input has-icon"
                                        placeholder="Location"
                                        value={profile.location}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                        required
                                    />
                                </div>
                            </div>

                            {/* Contact Field */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaPhone className="input-icon" />
                                    <input
                                        type="tel"
                                        name="contact"
                                        className="form-input has-icon"
                                        placeholder="Mobile Number"
                                        value={profile.contact}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            </div>

                            {/* Bio Field */}
                            <div className="form-group">
                                <div className="input-with-icon">
                                    <FaAddressCard className="input-icon" style={{ top: '15px' }} />
                                    <textarea
                                        name="bio"
                                        className="form-input has-icon"
                                        placeholder="Bio / About Yourself"
                                        rows="3"
                                        value={profile.bio}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%', resize: 'none' }}
                                    />
                                </div>
                            </div>

                            {/* Skills Field - Only for Volunteers */}
                            {profile.role === "volunteer" && (
                                <div className="form-group" ref={skillsRef}>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                                        Skills
                                    </label>
                                    <div
                                        className="form-input has-icon"
                                        style={{ cursor: isEditing ? "pointer" : "default", minHeight: '45px', display: 'flex', alignItems: 'center' }}
                                        onClick={() => isEditing && setShowSkills(!showSkills)}
                                    >
                                        {profile.skills && profile.skills.length > 0
                                            ? profile.skills.join(", ")
                                            : "No skills selected"}
                                    </div>

                                    {showSkills && isEditing && (
                                        <div className="skills-grid">
                                            {volunteerSkills.map((skill, index) => (
                                                <label key={index} className="skill-item">
                                                    <input
                                                        type="checkbox"
                                                        checked={profile.skills.includes(skill)}
                                                        onChange={(e) => {
                                                            if (e.target.checked) {
                                                                setProfile({
                                                                    ...profile,
                                                                    skills: [...profile.skills, skill]
                                                                });
                                                            } else {
                                                                setProfile({
                                                                    ...profile,
                                                                    skills: profile.skills.filter(s => s !== skill)
                                                                });
                                                            }
                                                        }}
                                                    />
                                                    {skill}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Availability Field - Only for Volunteers */}
                            {profile.role === "volunteer" && (
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', color: '#666', fontSize: '0.9rem' }}>
                                        Availability
                                    </label>
                                    <input
                                        type="date"
                                        name="availability"
                                        className="form-input"
                                        value={profile.availability}
                                        onChange={handleChange}
                                        disabled={!isEditing}
                                        style={{ width: '100%' }}
                                    />
                                </div>
                            )}

                            {/* Buttons */}
                            <div style={{ marginTop: '1rem' }}>
                                {!isEditing ? (
                                    <button
                                        type="button"
                                        className="btn-register"
                                        onClick={() => setIsEditing(true)}
                                        style={{ backgroundColor: '#FBC02D' }} // Yellow for Edit
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                                        <button
                                            type="submit"
                                            className="btn-register"
                                            style={{ backgroundColor: '#4CAF50' }} // Green for Save
                                        >
                                            Save
                                        </button>
                                        <button
                                            type="button"
                                            className="btn-register"
                                            onClick={() => setIsEditing(false)}
                                            style={{ backgroundColor: '#9e9e9e' }} // Grey for Cancel
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </form>

                        <div className="signin-link" style={{ marginTop: '1rem' }}>
                            <Link to="/dashboard">Back to Dashboard</Link>
                        </div>
                    </div>

                    <img src={BottomRightPlant} alt="" className="decor-bottom-right" />
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
