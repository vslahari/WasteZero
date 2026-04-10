import React, { useState, useEffect, useRef } from 'react';
import './Messaging.css';

const ChatWindow = ({ chat, messages, onSendMessage, currentUserId, onlineUsers = new Set() }) => {
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = (e) => {
        e.preventDefault();
        if (newMessage.trim()) {
            onSendMessage(newMessage);
            setNewMessage('');
        }
    };

    if (!chat) {
        return (
            <div className="chat-window empty-state">
                <div className="empty-icon">💬</div>
                <h3>Select a conversation to start messaging</h3>
                <p>Connect with other volunteers and NGOs instantly.</p>
            </div>
        );
    }

    return (
        <div className="chat-window">
            <div className="chat-header">
                <div className="chat-avatar" style={{ backgroundImage: chat.avatar ? `url(${chat.avatar})` : 'none' }}>
                    {!chat.avatar && chat.name?.charAt(0)}
                </div>
                <div className="chat-info">
                    <div className="chat-name">{chat.name}</div>
                    <div className="chat-status" style={{
                        fontSize: '0.8rem',
                        color: onlineUsers.has(String(chat.receiverId)) ? '#4caf50' : '#999'
                    }}>
                        {onlineUsers.has(String(chat.receiverId)) ? '• Online' : '• Offline'}
                    </div>
                </div>
            </div>

            <div className="chat-messages">
                {!messages || messages.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888', marginTop: '20px' }}>
                        Start the conversation with {chat.name}!
                    </div>
                ) : (
                    messages.map((msg) => {
                        const messageKey = msg._id || `${msg.senderId}-${msg.timestamp}-${msg.text}`;
                        const isSent = String(msg.senderId) === String(currentUserId);

                        return (
                            <div key={messageKey} className={`message ${isSent ? 'sent' : 'received'}`}>
                                <div className="message-content">{msg.text}</div>
                                <div className="message-time">
                                    {msg.timestamp ?
                                        new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                        : ''}
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <form className="chat-input-area" onSubmit={handleSend}>
                <input
                    type="text"
                    className="chat-input"
                    placeholder="Type a message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" className="send-button" disabled={!newMessage.trim()}>
                    ➤
                </button>
            </form>
        </div>
    );
};

export default ChatWindow;