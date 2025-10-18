import React, { useState, useEffect } from "react";
import VoiceInput from "../VoiceInput";
import StatsCounter from "./CounterHero";

// const VoiceInput = () => (
//   <div className="position-relative mb-3">
//     <input
//       type="text"
//       placeholder="Search restaurants, cuisines..."
//       className="form-control form-control-lg rounded-4 border-2 px-4 py-3"
//       style={{
//         backgroundColor: "rgba(255, 255, 255, 0.9)",
//         backdropFilter: "blur(10px)",
//         borderColor: "rgba(250, 204, 21, 0.3)",
//         transition: "all 0.3s ease",
//       }}
//       onFocus={(e) => (e.target.style.borderColor = "#facc15")}
//       onBlur={(e) => (e.target.style.borderColor = "rgba(250, 204, 21, 0.3)")}
//     />
//     <button
//       className="btn position-absolute top-50 end-0 translate-middle-y me-2 rounded-3"
//       style={{
//         padding: "0.5rem",
//         backgroundColor: "transparent",
//         border: "none",
//         transition: "background-color 0.3s ease",
//       }}
//       onMouseEnter={(e) =>
//         (e.target.style.backgroundColor = "rgba(250, 204, 21, 0.2)")
//       }
//       onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
//     >
//       <svg
//         width="20"
//         height="20"
//         fill="none"
//         stroke="#eab308"
//         strokeWidth="2"
//         strokeLinecap="round"
//         strokeLinejoin="round"
//       >
//         <circle cx="11" cy="11" r="8"></circle>
//         <path d="m21 21-4.35-4.35"></path>
//       </svg>
//     </button>
//   </div>
// );

const HeroSection = () => {
  const [activeCard, setActiveCard] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCard((prev) => (prev + 1) % 2);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes pulseDelayed {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        .animate-pulse {
          animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animate-pulse-delayed {
          animation: pulseDelayed 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
          animation-delay: 1s;
        }
        .bg-gradient-primary {
          background: linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #fef3c7 100%);
        }
        .text-gradient {
          background: linear-gradient(90deg, #111827 0%, #374151 50%, #111827 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .text-gradient-yellow {
          background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .glassmorphism {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }
        .glassmorphism-light {
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .btn-gradient {
          background: linear-gradient(90deg, #facc15 0%, #eab308 100%);
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(250, 204, 21, 0.3);
        }
        .btn-gradient:hover {
          background: linear-gradient(90deg, #eab308 0%, #ca8a04 100%);
          transform: scale(1.05);
          box-shadow: 0 20px 35px -5px rgba(250, 204, 21, 0.5);
        }
        .floating-card {
          transition: all 0.5s ease;
        }
        .floating-card.active {
          transform: scale(1.05);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .card-border {
          border: 2px solid rgba(250, 204, 21, 0.2);
        }
        .shadow-yellow {
          box-shadow: 0 20px 25px -5px rgba(250, 204, 21, 0.2);
        }
        .img-overlay::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.2), transparent);
        }
      `}</style>

      <section className="position-relative min-vh-100 bg-gradient-primary overflow-hidden py-5">
        {/* Animated Background Elements */}
        <div
          className="position-absolute top-0 start-0 w-100 h-100"
          style={{ zIndex: 0 }}
        >
          <div
            className="position-absolute animate-pulse rounded-circle"
            style={{
              top: "5rem",
              left: "2.5rem",
              width: "18rem",
              height: "18rem",
              backgroundColor: "rgba(253, 224, 71, 0.2)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="position-absolute animate-pulse-delayed rounded-circle"
            style={{
              bottom: "5rem",
              right: "2.5rem",
              width: "24rem",
              height: "24rem",
              backgroundColor: "rgba(250, 204, 21, 0.1)",
              filter: "blur(80px)",
            }}
          />
          <div
            className="position-absolute top-50 start-50 translate-middle rounded-circle"
            style={{
              width: "31rem",
              height: "31rem",
              backgroundColor: "rgba(254, 240, 138, 0.1)",
              filter: "blur(80px)",
            }}
          />
        </div>

        <div className="container position-relative overflow-x-hidden" style={{ zIndex: 0 }}>
          <div className="row align-items-center g-5 py-5">
            {/* Left Content */}
            <div className="col-lg-6">
              <div className="mb-4">
                {/* Badge */}
                <div className="d-inline-flex align-items-center gap-2 px-3 py-2 glassmorphism-light rounded-pill border card-border shadow-sm">
                  <svg
                    width="16"
                    height="16"
                    fill="none"
                    stroke="#ca8a04"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                    <polyline points="17 6 23 6 23 12"></polyline>
                  </svg>
                  <span className="small fw-medium text-dark">
                    Top Rated Service 2025
                  </span>
                </div>
              </div>
              {/* Main Heading */}
              <div className="mb-4">
                <h1 className="display-3 fw-bold lh-sm mb-3">
                  <span className="text-gradient d-block">
                    The Best Restaurants
                  </span>
                  <span className="text-gradient-yellow d-block">
                    in Your Home
                  </span>
                </h1>
                <p
                  className="lead text-secondary mb-0"
                  style={{ maxWidth: "28rem" }}
                >
                  Experience culinary excellence delivered to your doorstep.
                  Fresh, fast, and unforgettable.
                </p>
              </div>
              {/* Search Input */}
              <div className="mb-4 w-100" style={{ minWidth: "20rem" }}>
                <VoiceInput />
                <button className="btn btn-lg btn-gradient text-white fw-semibold rounded-4 px-5 py-3 border-0">
                  Order Now
                </button>
              </div>
              {/* Stats */}
              <StatsCounter />
            </div>

            {/* Right Content - Image Section */}
            <div className="col-lg-6">
              <div className="position-relative">
                {/* Main Image Container */}
                <div className="position-relative rounded-4 overflow-hidden shadow-yellow">
                  <div className="img-overlay position-relative">
                    <img
                      src="https://quickeat-react.vercel.app/assets/img/photo-1.png"
                      alt="Food delivery"
                      className="w-100 h-auto"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>

                {/* Floating Card 1 - Restaurant of the Month */}
                {/* <div
                  className={`position-absolute glassmorphism rounded-4 p-3 shadow card-border floating-card ${
                    activeCard === 0 ? "active" : ""
                  }`}
                  style={{
                    left: "-1.5rem",
                    top: "25%",
                    maxWidth: "280px",
                  }}
                >
                  <div className="d-flex gap-3">
                    <img
                      src="https://quickeat-react.vercel.app/assets/img/photo-2.jpg"
                      alt="Restaurant"
                      className="rounded-3"
                      style={{
                        width: "64px",
                        height: "64px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="flex-grow-1 overflow-hidden">
                      <div className="d-flex align-items-center gap-1 mb-1">
                        <svg
                          width="16"
                          height="16"
                          fill="none"
                          stroke="#eab308"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <circle cx="12" cy="8" r="7"></circle>
                          <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
                        </svg>
                        <span className="small text-secondary fw-medium">
                          Restaurant of the Month
                        </span>
                      </div>
                      <h6 className="fw-bold text-dark small mb-1 text-truncate">
                        The Wilmington
                      </h6>
                      <div className="d-flex gap-1">
                        {[...Array(4)].map((_, i) => (
                          <svg
                            key={i}
                            width="12"
                            height="12"
                            fill="#facc15"
                            stroke="#facc15"
                            strokeWidth="1"
                          >
                            <polygon
                              points="12,2 15,9 23,9 17,14 19,21 12,16 5,21 7,14 1,9 9,9"
                              transform="scale(0.5)"
                            />
                          </svg>
                        ))}
                        <svg
                          width="12"
                          height="12"
                          fill="rgba(250,204,21,0.5)"
                          stroke="rgba(250,204,21,0.5)"
                          strokeWidth="1"
                        >
                          <polygon
                            points="12,2 15,9 23,9 17,14 19,21 12,16 5,21 7,14 1,9 9,9"
                            transform="scale(0.5)"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div> */}

                {/* Floating Card 2 - Location
                <div
                  className={`position-absolute glassmorphism rounded-4 p-3 shadow card-border floating-card ${
                    activeCard === 1 ? "active" : ""
                  }`}
                  style={{
                    right: "-1.5rem",
                    bottom: "25%",
                  }}
                >
                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-3 d-flex align-items-center justify-content-center"
                      style={{
                        width: "48px",
                        height: "48px",
                        background:
                          "linear-gradient(135deg, #facc15 0%, #eab308 100%)",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div>
                      <h6 className="fw-bold text-dark small mb-0">
                        12 Restaurants
                      </h6>
                      <p className="small text-secondary mb-0">In Your City</p>
                    </div>
                  </div>
                </div> */}

                {/* Decorative Elements */}
                <div
                  className="position-absolute rounded-circle"
                  style={{
                    top: "-1.5rem",
                    right: "-1.5rem",
                    width: "8rem",
                    height: "8rem",
                    backgroundColor: "rgba(250, 204, 21, 0.2)",
                    filter: "blur(50px)",
                    zIndex: -1,
                  }}
                />
                <div
                  className="position-absolute rounded-circle"
                  style={{
                    bottom: "-1.5rem",
                    left: "-1.5rem",
                    width: "10rem",
                    height: "10rem",
                    backgroundColor: "rgba(253, 224, 71, 0.2)",
                    filter: "blur(50px)",
                    zIndex: -1,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HeroSection;
