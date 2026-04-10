import React from 'react';
import './Messaging.css';

const ChatList = ({ chats, activeChat, onSelectChat }) => {
    return (
        <div className="chat-list-sidebar">
            <div className="chat-list-header">
                Messages
            </div>
            <div className="chat-list-items">
                {chats.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
                        No conversations yet
                    </div>
                ) : (
                    chats.map(chat => (
                        <div
                            key={chat.id}
                            className={`chat-item ${activeChat?.id === chat.id ? 'active' : ''}`}
                            onClick={() => onSelectChat(chat)}
                        >
                            <div className="chat-avatar" style={{ backgroundImage: chat.avatar ? `url(${chat.avatar})` : 'none' }}>
                                {!chat.avatar && chat.name.charAt(0)}
                            </div>
                            <div className="chat-info">
                                <div className="chat-name">{chat.name}</div>
                                <div className="chat-preview">{chat.lastMessage}</div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ChatList;