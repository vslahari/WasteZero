import React, { useState, useRef, useEffect } from 'react';
import { useNotification } from '../../context/NotificationContext';
import './Notification.css';

const NotificationIcon = () => {
    const { notifications, unreadCount, markAsRead, clearNotifications } = useNotification();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => {
        if (!isOpen) {
            markAsRead();
        }
        setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="notification-container" ref={dropdownRef}>
            <div className="notification-icon" onClick={toggleDropdown}>
                🔔
                {unreadCount > 0 && (
                    <div className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</div>
                )}
            </div>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        {notifications.length > 0 && (
                            <button className="clear-btn" onClick={clearNotifications}>
                                Clear All
                            </button>
                        )}
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-notifications">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((note, index) => (
                                <div key={index} className="notification-item">
                                    <div className="notification-text">{note.message || note.text}</div>
                                    <div className="notification-time">
                                        {note.timestamp ? new Date(note.timestamp).toLocaleTimeString() : 'Just now'}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationIcon;
