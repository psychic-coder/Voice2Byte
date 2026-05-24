import Layout from "@/src/layouts/Layout";
import React, { useState } from "react";

const Contacts = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-yellow-50">
        <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.2); }
          50% { box-shadow: 0 0 40px rgba(234, 179, 8, 0.4); }
        }
        
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
        }

        .glass-card:hover {
          background: rgba(255, 255, 255, 0.85);
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(234, 179, 8, 0.15);
        }

        .contact-icon {
          background: linear-gradient(135deg, #fbbf24, #eab308);
          transition: all 0.3s ease;
        }

        .glass-card:hover .contact-icon {
          transform: scale(1.1) rotate(5deg);
          box-shadow: 0 10px 25px rgba(234, 179, 8, 0.3);
        }

        .form-input {
          background: rgba(255, 255, 255, 0.6);
          border: 2px solid rgba(234, 179, 8, 0.2);
          transition: all 0.3s ease;
        }

        .form-input:focus {
          background: rgba(255, 255, 255, 0.9);
          border-color: #eab308;
          box-shadow: 0 0 0 4px rgba(234, 179, 8, 0.1);
          outline: none;
        }

        .submit-btn {
          background: linear-gradient(135deg, #fbbf24, #eab308);
          background-size: 200% 200%;
          animation: gradient-shift 3s ease infinite;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(234, 179, 8, 0.4);
        }

        .float-animation {
          animation: float 6s ease-in-out infinite;
        }

        .breadcrumb-link {
          transition: all 0.3s ease;
          color: #6b7280;
          text-decoration: none;
        }

        .breadcrumb-link:hover {
          color: #eab308;
          transform: translateX(5px);
        }

        .map-container {
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
          border: 2px solid rgba(234, 179, 8, 0.2);
        }

        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #eab308, transparent);
          opacity: 0.3;
        }

        .email-link, .phone-link {
          transition: all 0.2s ease;
        }

        .email-link:hover, .phone-link:hover {
          transform: translateX(3px);
          color: #eab308 !important;
        }
      `}</style>

        {/* Hero Section */}
        <section className="py-5">
          <div className="container px-4">
            <div className="row align-items-center g-5">
              <div className="col-xl-6 col-lg-12">
                {/* Breadcrumb */}
                <nav className="mb-4">
                  <ol className="list-unstyled d-flex align-items-center gap-2 mb-0">
                    <li>
                      <a href="/" className="breadcrumb-link">
                        Home
                      </a>
                    </li>
                    <li style={{ color: "#eab308" }}>
                      <i className="fa-solid fa-right-long"></i>
                    </li>
                    <li style={{ color: "#1f2937", fontWeight: "600" }}>
                      Contacts
                    </li>
                  </ol>
                </nav>

                {/* Heading */}
                <div className="mb-5">
                  <h2
                    className="display-4 fw-bold mb-3"
                    style={{
                      background: "linear-gradient(135deg, #1f2937, #4b5563)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Contact us
                  </h2>
                  <p className="fs-5 mb-4" style={{ color: "#6b7280" }}>
                    Egestas sed tempus urna et pharetra pharetra massa.
                    Fermentum posuere urna nec tincidunt praesent semper.
                  </p>
                  <div className="section-divider"></div>
                </div>

                {/* Contact Cards */}
                <div className="row g-4">
                  <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="glass-card rounded-4 p-4 h-100">
                      <div
                        className="contact-icon d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        <i className="fa-solid fa-location-dot text-white fs-4"></i>
                      </div>
                      <h6 className="fw-bold mb-2" style={{ color: "#1f2937" }}>
                        Location
                      </h6>
                      <p className="small mb-0" style={{ color: "#6b7280" }}>
                        1717 Harrison St, San Francisco, CA 94103, United States
                      </p>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="glass-card rounded-4 p-4 h-100">
                      <div
                        className="contact-icon d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        <i className="fa-solid fa-envelope text-white fs-4"></i>
                      </div>
                      <h6 className="fw-bold mb-3" style={{ color: "#1f2937" }}>
                        Email
                      </h6>
                      <a
                        href="mailto:quick.info@mail.net"
                        className="email-link text-decoration-none d-block mb-2"
                      >
                        <p
                          className="small fw-semibold mb-1"
                          style={{ color: "#374151" }}
                        >
                          quick.info@mail.net
                        </p>
                        <p className="small mb-0" style={{ color: "#9ca3af" }}>
                          Lorem ipsum dolor sit.
                        </p>
                      </a>
                      <a
                        href="mailto:quick.info@mail.net"
                        className="email-link text-decoration-none d-block"
                      >
                        <p
                          className="small fw-semibold mb-1"
                          style={{ color: "#374151" }}
                        >
                          quick.info@mail.net
                        </p>
                        <p className="small mb-0" style={{ color: "#9ca3af" }}>
                          Dolore magna aliqua
                        </p>
                      </a>
                    </div>
                  </div>

                  <div className="col-lg-4 col-md-4 col-sm-12">
                    <div className="glass-card rounded-4 p-4 h-100">
                      <div
                        className="contact-icon d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                        style={{
                          width: "60px",
                          height: "60px",
                        }}
                      >
                        <i className="fa-solid fa-phone text-white fs-4"></i>
                      </div>
                      <h6 className="fw-bold mb-3" style={{ color: "#1f2937" }}>
                        Phone
                      </h6>
                      <a
                        href="tel:+14253261627"
                        className="phone-link text-decoration-none d-block mb-2"
                      >
                        <p
                          className="small fw-semibold mb-1"
                          style={{ color: "#374151" }}
                        >
                          +1 425 326 16 27
                        </p>
                        <p className="small mb-0" style={{ color: "#9ca3af" }}>
                          Et netus et malesuada
                        </p>
                      </a>
                      <a
                        href="tel:+14253261627"
                        className="phone-link text-decoration-none d-block"
                      >
                        <p
                          className="small fw-semibold mb-1"
                          style={{ color: "#374151" }}
                        >
                          +1 425 326 16 27
                        </p>
                        <p className="small mb-0" style={{ color: "#9ca3af" }}>
                          Enim tortor auctor urna
                        </p>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-xl-6 col-lg-12">
                <div className="float-animation text-center">
                  <img
                    alt="contacts-img-girl"
                    src="https://quickeat-react.vercel.app/assets/img/contacts-1.png"
                    className="img-fluid"
                    style={{ maxWidth: "100%", height: "auto" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form & Map Section */}
        <section className="py-5">
          <div className="container px-4">
            <div className="row g-5">
              <div className="col-lg-12">
                <div className="row g-4">
                  {/* Contact Form */}
                  <div className="col-lg-6">
                    <div className="glass-card rounded-4 p-5 h-100">
                      <h3 className="fw-bold mb-3" style={{ color: "#1f2937" }}>
                        Get in touch with us
                      </h3>
                      <p className="mb-4" style={{ color: "#6b7280" }}>
                        Magna sit amet purus gravida quis blandit turpis cursus.
                        Venenatis tellus in metus vulputate eu scelerisque
                        felis.
                      </p>

                      <div className="mt-4">
                        <div className="mb-4 position-relative">
                          <div
                            className="position-absolute top-50 translate-middle-y ms-3"
                            style={{ color: "#eab308" }}
                          >
                            <i className="fa-regular fa-user"></i>
                          </div>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter your name"
                            className="form-input w-100 rounded-3 py-3 ps-5 pe-3"
                          />
                        </div>

                        <div className="mb-4 position-relative">
                          <div
                            className="position-absolute top-50 translate-middle-y ms-3"
                            style={{ color: "#eab308" }}
                          >
                            <i className="fa-regular fa-envelope"></i>
                          </div>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter your email"
                            className="form-input w-100 rounded-3 py-3 ps-5 pe-3"
                          />
                        </div>

                        <div className="mb-4">
                          <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Enter your message"
                            rows="5"
                            className="form-input w-100 rounded-3 p-3"
                            style={{ resize: "vertical" }}
                          />
                        </div>

                        <button
                          onClick={handleSubmit}
                          className="submit-btn w-100 border-0 text-white fw-semibold py-3 rounded-3"
                        >
                          Submit Application
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Map */}
                  <div className="col-lg-6">
                    <div
                      className="map-container h-100"
                      style={{ minHeight: "500px" }}
                    >
                      <iframe
                        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2689446.104646556!2d28.705460424349365!3d48.83127549941125!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40d1d9c154700e8f%3A0x1068488f64010!2sUkraine!5e0!3m2!1sen!2s!4v1661009847728!5m2!1sen!2s"
                        width="100%"
                        height="100%"
                        style={{ border: 0, minHeight: "500px" }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        title="Google Maps Location"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
};

export default Contacts;
