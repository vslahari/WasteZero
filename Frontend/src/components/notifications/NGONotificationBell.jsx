import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationBell.css';

const NGONotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    // NGO only sees new applications
    const applicationNotifications = notifications.filter(n => n.type === 'application');

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            markAsRead(notification._id);
        }
    };

    return (
        <div className="notification-bell-container">
            <button
                className="notification-bell-btn"
                onClick={() => setIsOpen(!isOpen)}
            >
                🔔
                {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                )}
            </button>

            {isOpen && (
                <div className="notification-dropdown">
                    <div className="notification-header">
                        <h3>New Applications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="mark-all-btn">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-list">
                        {applicationNotifications.length === 0 ? (
                            <p className="no-notifications">No new applications</p>
                        ) : (
                            applicationNotifications.map(notification => (
                                <div
                                    key={notification._id}
                                    className={`notification-item application ${!notification.isRead ? 'unread' : ''}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="notification-icon" style={{ color: '#2196F3' }}>📝</div>
                                    <div className="notification-content">
                                        <p>{notification.message}</p>
                                        <span className="notification-time">
                                            {new Date(notification.createdAt).toLocaleString()}
                                        </span>
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

export default NGONotificationBell;
