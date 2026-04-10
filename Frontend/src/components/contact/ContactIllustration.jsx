import contactImg from "../../assets/contact.svg";
import "./ContactIllustration.css";

const ContactIllustration = () => {
  return (
    <div className="illustration-container">
      <img src={contactImg} alt="Contact Illustration" />
      <h2 className="brand-text">
        Waste <span style={{ color: '#4CAF50' }}>Zero</span>
      </h2>

    </div>

  );
};

export default ContactIllustration;
