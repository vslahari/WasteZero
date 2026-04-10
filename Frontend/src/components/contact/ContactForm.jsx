import React, { useState } from 'react';
import apiService from '../../services/apiService';
import "./ContactForm.css";

const ContactForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.type === 'textarea' ? 'message' : e.target.type === 'email' ? 'email' : e.target.placeholder.toLowerCase() === 'username' ? 'name' : 'message']: e.target.value });
    // Note: The previous logic relied on placeholder for name. Let's make inputs tighter.
  };

  // Better approach: explicit name attributes
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    try {
      await apiService.sendMessage(formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus(''), 3000);
    } catch (error) {
      console.error("Error sending message", error);
      setStatus('error');
    }
  };

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <h2>Contact Us</h2>

      <input
        type="text"
        name="name"
        placeholder="Username"
        value={formData.name}
        onChange={handleInputChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleInputChange}
        required
      />
      <textarea
        name="message"
        placeholder="Message"
        value={formData.message}
        onChange={handleInputChange}
        required
      ></textarea>

      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>

      {status === 'success' && <p style={{ color: 'green', marginTop: '10px' }}>Message sent successfully!</p>}
      {status === 'error' && <p style={{ color: 'red', marginTop: '10px' }}>Failed to send message.</p>}
    </form>
  );
};

export default ContactForm;
