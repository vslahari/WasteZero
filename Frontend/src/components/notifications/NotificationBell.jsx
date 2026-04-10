import React, { useState } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import './NotificationBell.css';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('matches');

    const matchNotifications = notifications.filter(n => n.type === 'match');
    const applicationNotifications = notifications.filter(n => n.type === 'application' || n.type === 'approval' || n.type === 'rejection');

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
                        <h3>Notifications</h3>
                        {unreadCount > 0 && (
                            <button onClick={markAllAsRead} className="mark-all-btn">
                                Mark all read
                            </button>
                        )}
                    </div>

                    <div className="notification-tabs">
                        <button
                            className={`tab-btn ${activeTab === 'matches' ? 'active' : ''}`}
                            onClick={() => setActiveTab('matches')}
                        >
                            Matches ({matchNotifications.length})
                        </button>
                        <button
                            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
                            onClick={() => setActiveTab('applications')}
                        >
                            Applications ({applicationNotifications.length})
                        </button>
                    </div>

                    <div className="notification-list">
                        {activeTab === 'matches' && (
                            matchNotifications.length === 0 ? (
                                <p className="no-notifications">No match notifications</p>
                            ) : (
                                matchNotifications.map(notification => (
                                    <div
                                        key={notification._id}
                                        className={`notification-item match ${!notification.isRead ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-icon">🎯</div>
                                        <div className="notification-content">
                                            <p>{notification.message}</p>
                                            <span className="notification-time">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}

                        {activeTab === 'applications' && (
                            applicationNotifications.length === 0 ? (
                                <p className="no-notifications">No application notifications</p>
                            ) : (
                                applicationNotifications.map(notification => (
                                    <div
                                        key={notification._id}
                                        className={`notification-item application ${!notification.isRead ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notification)}
                                    >
                                        <div className="notification-icon">📝</div>
                                        <div className="notification-content">
                                            <p>{notification.message}</p>
                                            <span className="notification-time">
                                                {new Date(notification.createdAt).toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
