import React, { useState, useRef } from "react";
import "./HomePages.css";
import doctorImg from "../Images.js/doctor.png";
import hospitalImg from "../Images.js/hospital.png";
import Carousel from "react-bootstrap/Carousel";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";

function HomePages() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");

  const aboutRef = useRef(null);
  const servicesRef = useRef(null);

  const openLogin = (role) => {
    setSelectedRole(role);
    setShowLogin(true);
    setShowSignup(false);
  };

  const openSignup = (role) => {
    setSelectedRole(role);
    setShowSignup(true);
    setShowLogin(false);
  };

  const closeLogin = () => {
    setShowLogin(false);
    setSelectedRole("");
  };

  const closeSignup = () => {
    setShowSignup(false);
    setSelectedRole("");
  };

  const scrollToAbout = () => {
    aboutRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const scrollToServices = () => {
    servicesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="home-container">
      {/* ===== HEADER ===== */}
      <header className="home-header">
        <div className="home-logo">
          <span className="logo-icon">🏥</span>
          <span className="logo-text">Advance Hospital</span>
        </div>
        <nav className="home-nav">
          <a href="/" className="nav-link">Home</a>
          <button onClick={scrollToAbout} className="nav-btn">About Us</button>
          <button onClick={scrollToServices} className="nav-btn">Services</button>
          <button
            className="login-btn receptionist-btn"
            onClick={() => openLogin("Receptionist")}
          >
            <span className="btn-icon">👨‍💼</span>
            Receptionist
          </button>
          <button
            className="login-btn doctor-btn"
            onClick={() => openLogin("Doctor")}
          >
            <span className="btn-icon">👨‍⚕️</span>
            Doctor
          </button>
        </nav>
      </header>

      {/* ===== FULL-WIDTH CAROUSEL ===== */}
      <section className="fullwidth-carousel-section">
        <Carousel fade controls indicators interval={4000} pause="hover" className="fullwidth-carousel">
          <Carousel.Item>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={hospitalImg}
                alt="Hospital Building"
              />
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h1 className="carousel-title">Welcome to Advance Hospital</h1>
                <p className="carousel-description">State-of-the-art healthcare facility with modern infrastructure and advanced medical equipment</p>
                <span className="carousel-badge">24/7 Emergency</span>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={doctorImg}
                alt="Expert Doctors"
              />
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h1 className="carousel-title">Expert Medical Team</h1>
                <p className="carousel-description">Highly qualified doctors and specialized surgeons dedicated to your health</p>
                <span className="carousel-badge">50+ Specialists</span>
              </div>
            </div>
          </Carousel.Item>

          <Carousel.Item>
            <div className="carousel-image-container">
              <img
                className="carousel-image"
                src={hospitalImg}
                alt="Patient Care"
              />
              <div className="carousel-overlay"></div>
              <div className="carousel-content">
                <h1 className="carousel-title">Compassionate Care</h1>
                <p className="carousel-description">Patient-first approach with personalized treatment and care</p>
                <span className="carousel-badge">10K+ Happy Patients</span>
              </div>
            </div>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* ===== SERVICES SECTION ===== */}
     

      {/* ===== ABOUT SECTION ===== */}
      <section className="about-section" ref={aboutRef}>
        <div className="about-container">
          <div className="about-content">
            <h2 className="about-title">About Advance Hospital</h2>
            <p className="about-text">
              Advance Hospital is a modern healthcare institution committed to
              delivering high-quality medical services supported by advanced
              technology and compassionate care.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Online appointment booking</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Doctor & receptionist login</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Secure patient data management</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Reduced waiting time</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>Improved hospital productivity</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">✓</span>
                <span>24/7 Emergency services</span>
              </div>
            </div>
          </div>
          
          <div className="about-stats">
            <div className="stat-box">
              <div className="stat-number">15+</div>
              <div className="stat-label">Years of Excellence</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">50+</div>
              <div className="stat-label">Expert Doctors</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">10K+</div>
              <div className="stat-label">Happy Patients</div>
            </div>
            <div className="stat-box">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Emergency Care</div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== LOGIN POPUP ===== */}
      {showLogin && (
        <LoginForm
          role={selectedRole}
          onClose={closeLogin}
          onSwitchToSignup={openSignup}
        />
      )}

      {/* ===== SIGNUP POPUP ===== */}
      {showSignup && (
        <SignupForm
          role={selectedRole}
          onClose={closeSignup}
          onSwitchToLogin={openLogin}
        />
      )}

      {/* ===== FOOTER ===== */}
      <footer className="home-footer">
        <div className="footer-section">
          <h4>Advance Hospital</h4>
          <p>📍 Dhule, Maharashtra - 424001</p>
          <p>📞 +91 98765 43210</p>
          <p>✉️ support@advancehospital.com</p>
        </div>

        <div className="footer-section">
          <h4>Quick Links</h4>
          <p>About Us</p>
          <p>Services</p>
          <p>Doctors</p>
          <p>Contact</p>
        </div>

        <div className="footer-section">
          <h4>Terms & Conditions</h4>
          <p>Privacy Policy</p>
          <p>User Agreement</p>
          <p>Refund Policy</p>
        </div>

        <div className="footer-section">
          <h4>Hospital Location</h4>
          <iframe
            title="hospital-map"
            className="footer-map"
            src="https://www.google.com/maps/embed?pb=!4v1770462259569!6m8!1m7!1sVxVvvQZtKJZjePpUvFAzAQ!2m2!1d20.91664272034978!2d74.77042149969776!3f119.09408205301271!4f28.71417756552215!5f0.7820865974627469"
            frameBorder="0"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
      </footer>
    </div>
  );
}

export default HomePages;