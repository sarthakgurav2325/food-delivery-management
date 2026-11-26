

import {
  Utensils,
  ArrowRight,
  Truck,
  Clock,
  ShieldCheck,
  MapPin,
  Mail,
    Phone,
  ClipboardList,
    Users,
} from "lucide-react";

import "./Home.css";

function HomePage({ onAdminLogin }) {
  return (
    <div className="public-home">
      
{/* NAVBAR */}
<nav className="home-navbar">
  <div className="home-nav-container">

    <a href="#home" className="home-logo">
      <span className="logo-icon">🍽️</span>
      <span>Food<span>Express</span></span>
    </a>

    <div className="home-nav-links">
      <a href="#home" className="active">Home</a>
      <a href="#about">About Us</a>
      <a href="#services">Services</a>
      <a href="#contact">Contact Us</a>
    </div>

    <button
      className="home-nav-login"
      onClick={onAdminLogin}
    >
      Admin Login
    </button>

  </div>
</nav>


      {/* HERO SECTION */}
      <section className="home-hero" id="home">
        <div className="hero-content">
          <span className="hero-tag">FOOD DELIVERY MANAGEMENT SYSTEM</span>

          <h1>
            Delicious Food.
            <br />
            <span>Food Delivery Management.</span>
          </h1>

          <p>
            Manage food orders, customers, delivery partners, and restaurant
            operations with one powerful management system.
          </p>

          <button className="hero-button" onClick={onAdminLogin}>
            Admin Login <ArrowRight size={19} />
          </button>

          <div className="hero-features">
            <span><Clock size={17} /> Fast Management</span>
            <span><ShieldCheck size={17} /> Secure Admin Access</span>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image" />
        </div>
      </section>
    

{/* ABOUT SECTION */}
<section className="home-about" id="about">

  <div className="about-image">
    <img
      src="/images/about-pizza.jpg"
      alt="Fresh food prepared for FoodExpress"
    />

    <div className="about-brand-card">
      <div className="about-brand-icon">
        <Utensils size={28} />
      </div>
      <div>
        <h3>FoodExpress</h3>
        <p>Smart Food Management</p>
      </div>
    </div>

    <div className="about-experience-card">
      <Truck size={25} />
      <div>
        <strong>Smart Delivery</strong>
        <span>Organized operations</span>
      </div>
    </div>
  </div>

  <div className="about-content">
    <span className="home-section-tag">ABOUT FOOD EXPRESS</span>

    <h2>
      Making Food Delivery
      <span> Management Simple</span>
    </h2>

    <p>
      FoodExpress is a modern Food Delivery Management System
      designed to simplify restaurant operations through one
      centralized platform.
    </p>

    <p>
      From managing food items and customer details to tracking
      orders and delivery partners, our system helps administrators
      manage everything efficiently.
    </p>

    <div className="about-features">
      <div>
        <Utensils size={21} />
        <span>Food Management</span>
      </div>

      <div>
        <Clock size={21} />
        <span>Order Management</span>
      </div>

      <div>
        <Truck size={21} />
        <span>Delivery Management</span>
      </div>

      <div>
        <ShieldCheck size={21} />
        <span>Secure Admin Access</span>
      </div>
    </div>

    <button className="about-cta" onClick={onAdminLogin}>
      Explore Admin Dashboard
      <ArrowRight size={18} />
    </button>
  </div>

</section>

     
      {/* PROJECT FEATURES */}
<section className="home-services" id="services">

  <div className="home-section-heading">
    <span>OUR PROJECT FEATURES</span>
    <h2>Powerful Food Management Features</h2>
    <p>
      Manage your complete food delivery operations from one
      simple and organized dashboard.
    </p>
  </div>

  <div className="services-grid">

    <div className="service-card">
      <div className="service-icon">
        <Utensils size={28} />
      </div>
      <h3>Food Management</h3>
      <p>
        Add, edit, view and manage food items, prices,
        categories and availability.
      </p>
    </div>

    <div className="service-card">
      <div className="service-icon">
        <ClipboardList size={28} />
      </div>
      <h3>Order Management</h3>
      <p>
        Create, view, update and cancel customer food orders
        while managing order status.
      </p>
    </div>

    <div className="service-card">
      <div className="service-icon">
        <Users size={28} />
      </div>
      <h3>Customer Management</h3>
      <p>
        Maintain customer information, contact details
        and delivery addresses.
      </p>
    </div>

    <div className="service-card">
      <div className="service-icon">
        <Truck size={28} />
      </div>
      <h3>Delivery Partner Management</h3>
      <p>
        Manage delivery partners, vehicle details
        and their availability.
      </p>
    </div>

    <div className="service-card">
      <div className="service-icon">
        <MapPin size={28} />
      </div>
      <h3>Order Tracking</h3>
      <p>
        Monitor order progress and delivery status
        from confirmation to completion.
      </p>
    </div>

    <div className="service-card">
      <div className="service-icon">
        <ShieldCheck size={28} />
      </div>
      <h3>Admin Dashboard</h3>
      <p>
        Access a centralized dashboard with order,
        food, customer and delivery statistics.
      </p>
    </div>

  </div>
</section>

     
{/* CONTACT SECTION */}
<section className="home-contact" id="contact">

  <div className="contact-content">
    <span className="home-section-tag">CONTACT US</span>

    <h2>Get In Touch With <span>FoodExpress</span></h2>

    <p>
      Have questions about our Food Delivery Management System?
      Send us a message and we will be happy to assist you.
    </p>

    <form
      className="contact-form"
      onSubmit={(e) => {
        e.preventDefault();

        const form = e.currentTarget;
        const data = new FormData(form);

        const name = data.get("name");
        const email = data.get("email");
        const subject = data.get("subject");
        const message = data.get("message");

        const mailto = `mailto:support@foodexpress.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        )}`;

        window.location.href = mailto;
      }}
    >

      <div className="contact-form-row">
        <div className="contact-form-group">
          <label>Your Name</label>
          <input
            type="text"
            name="name"
            placeholder="Enter your name"
            required
          />
        </div>

        <div className="contact-form-group">
          <label>Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            required
          />
        </div>
      </div>

      <div className="contact-form-group">
        <label>Subject</label>
        <input
          type="text"
          name="subject"
          placeholder="Enter subject"
          required
        />
      </div>

      <div className="contact-form-group">
        <label>Message</label>
        <textarea
          name="message"
          rows="5"
          placeholder="Write your message here..."
          required
        />
      </div>

      <button type="submit" className="contact-submit-btn">
        Send Message <ArrowRight size={18} />
      </button>

    </form>
  </div>

  <div className="contact-image-wrapper">
    <img
      src="/images/delivery-rider.jpg"
      alt="FoodExpress delivery partner"
    />

    <div className="contact-image-overlay">
      <Truck size={27} />
      <div>
        <strong>FoodExpress</strong>
        <span>Smart Food Management</span>
      </div>
    </div>
  </div>

</section>

```jsx
{/* FOOTER */}
<footer className="home-footer">
  <div className="footer-main">

    <div className="footer-brand">
      <div className="footer-logo">
        <Utensils size={27} />
        <h2>FoodExpress</h2>
      </div>
      <p>
        Smart Food Management. A centralized platform
        to manage food items, customers, orders and
        delivery operations efficiently.
      </p>
      <div className="footer-socials">
        <a href="https://www.facebook.com/" target="_blank" rel="noreferrer">Facebook</a>
        <a href="https://www.instagram.com/" target="_blank" rel="noreferrer">Instagram</a>
        <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer">LinkedIn</a>
      </div>
    </div>

    <div className="footer-links">
      <h3>Quick Links</h3>
      <a href="#home">Home</a>
      <a href="#about">About Us</a>
      <a href="#services">Our Features</a>
      <a href="#contact">Contact Us</a>
    </div>

    <div className="footer-links">
      <h3>Our Features</h3>
      <a href="#services">Food Management</a>
      <a href="#services">Order Management</a>
      <a href="#services">Customer Management</a>
      <a href="#services">Delivery Management</a>
      <a href="#services">Order Tracking</a>
    </div>

    <div className="footer-contact">
      <h3>Contact Us</h3>

      <p>
        <Mail size={18} />
        <a href="mailto:support@foodexpress.com">
          support@foodexpress.com
        </a>
      </p>

      <p>
        <Phone size={18} />
        <a href="tel:+919876543210">
          +91 98765 43210
        </a>
      </p>

      <p>
        <MapPin size={18} />
        <span>Nashik, Maharashtra, India</span>
      </p>
    </div>

  </div>

  <div className="footer-bottom">
    <p>© {new Date().getFullYear()} FoodExpress. All Rights Reserved.</p>
    <p>Smart Food Management System</p>
  </div>
</footer>
```
    </div>
  );
}



export default HomePage;
