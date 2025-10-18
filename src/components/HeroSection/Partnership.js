import Link from "next/link";

const Partnership = () => {
  const partnershipOptions = [
    {
      title: "Join as Courier",
      description: "Deliver happiness and earn on your schedule",
      image: "https://quickeat-react.vercel.app/assets/img/photo-6.jpg",
    },
    {
      title: "Join as Merchant",
      description: "Grow your business with our platform",
      image: "https://quickeat-react.vercel.app/assets/img/photo-7.jpg",
    },
  ];

  return (
    <section className="partnership-section py-5">
      <div className="container py-4">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="partnership-title mb-3">Partner With Us</h2>
          <p className="partnership-subtitle">
            Join our growing network and unlock new opportunities
          </p>
        </div>

        {/* Partnership Cards */}
        <div className="row g-4">
          {partnershipOptions.map((option, index) => (
            <div
              key={index}
              className="col-lg-6"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <div className="partnership-card">
                <div className="card-image-wrapper">
                  <img
                    src={option.image}
                    alt={option.title}
                    className="card-image"
                  />
                </div>

                <div className="card-content">
                  <div className="card-text">
                    <h3 className="card-title">{option.title}</h3>
                    <p className="card-description">{option.description}</p>
                  </div>

                  <Link href="/become-partner" className="partnership-btn">
                    <span>Learn More</span>
                    <i className="fa-solid fa-arrow-right ms-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .partnership-section {
          background: linear-gradient(180deg, #1a1a1a 0%, #262626 100%);
          position: relative;
          overflow: hidden;
        }

        .partnership-section::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 215, 0, 0.3),
            transparent
          );
        }

        .partnership-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 700;
          color: #ffffff;
          letter-spacing: -0.5px;
          position: relative;
          display: inline-block;
        }

        .partnership-title::after {
          content: "";
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #ffd700, #ffa500);
          border-radius: 2px;
        }

        .partnership-subtitle {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1.1rem;
          margin-top: 1.5rem;
        }

        .partnership-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: #2a2a2a;
          border: 1px solid rgba(255, 215, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .partnership-card:hover {
          transform: translateY(-8px);
          border-color: rgba(255, 215, 0, 0.3);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.15);
        }

        .card-image-wrapper {
          position: relative;
          width: 100%;
          padding-top: 60%;
          overflow: hidden;
        }

        .card-image {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s ease;
        }

        .partnership-card:hover .card-image {
          transform: scale(1.1);
        }

        .card-content {
          padding: 2rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          flex-grow: 1;
        }

        .card-text {
          flex-grow: 1;
        }

        .card-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #ffffff;
          margin-bottom: 0.75rem;
          letter-spacing: -0.3px;
        }

        .card-description {
          color: rgba(255, 255, 255, 0.7);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        .partnership-btn {
          display: inline-flex;
          align-items: center;
          padding: 0.875rem 1.75rem;
          background: linear-gradient(135deg, #ffd700, #ffa500);
          color: #1a1a1a;
          border-radius: 50px;
          font-weight: 600;
          font-size: 0.95rem;
          text-decoration: none;
          transition: all 0.3s ease;
          align-self: flex-start;
          position: relative;
          overflow: hidden;
        }

        .partnership-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #ffa500, #ffd700);
          transition: left 0.3s ease;
        }

        .partnership-btn span,
        .partnership-btn i {
          position: relative;
          z-index: 1;
        }

        .partnership-btn:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 15px rgba(255, 215, 0, 0.4);
          color: #1a1a1a;
        }

        .partnership-btn:hover::before {
          left: 0;
        }

        .partnership-btn i {
          transition: transform 0.3s ease;
        }

        .partnership-btn:hover i {
          transform: translateX(4px);
        }

        @media (max-width: 991px) {
          .card-content {
            padding: 1.5rem;
          }

          .card-title {
            font-size: 1.5rem;
          }
        }

        @media (max-width: 576px) {
          .partnership-section {
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }

          .card-image-wrapper {
            padding-top: 70%;
          }
        }
      `}</style>
    </section>
  );
};

export default Partnership;
