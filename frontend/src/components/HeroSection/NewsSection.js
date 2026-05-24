import React from "react";
import Link from "next/link";

const NewsSection = () => {
  const mainNews = {
    image: "https://quickeat-react.vercel.app/assets/img/photo-8.jpg",
    categories: ["news", "VoiceToByte"],
    title: "We Have Received An Award For The Quality Of Our Work",
    description:
      "Donec adipiscing tristique risus nec feugiat in fermentum. Sapien eget mi proin sed libero. Et magnis dis parturient montes nascetur. Praesent semper feugiat nibh sed pulvinar proin gravida.",
    author: "VoiceToByte",
    date: "01.Jan. 2022",
    views: "132",
  };

  const sideNews = [
    {
      image: "https://quickeat-react.vercel.app/assets/img/food-1.jpg",
      categories: ["restaurants", "cooking"],
      title: "With VoiceToByte you can order food for the whole day",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...",
      author: "VoiceToByte",
      date: "01.Jan. 2022",
      views: "132",
    },
    {
      image: "https://quickeat-react.vercel.app/assets/img/food-1.jpg",
      categories: ["restaurants", "cooking"],
      title: "127+ Couriers On Our Team!",
      description:
        "Urna condimentum mattis pellentesque id nibh tortor id aliquet. Tellus at urna condimentum mattis...",
      author: "VoiceToByte",
      date: "01.Jan. 2022",
      views: "132",
    },
    {
      image: "https://quickeat-react.vercel.app/assets/img/food-3.jpg",
      categories: ["restaurants", "cooking"],
      title: "Why You Should Optimize Your Menu for Delivery",
      description:
        "Enim lobortis scelerisque fermentum dui. Sit amet cursus sit amet dictum sit amet. Rutrum tellus...",
      author: "VoiceToByte",
      date: "01.Jan. 2022",
      views: "132",
    },
  ];

  const NewsMeta = ({ author, date, views }) => (
    <div className="d-flex align-items-center gap-3 mt-3 flex-wrap">
      <span className="meta-item">
        <i className="fa-solid fa-user me-1" />
        {author}
      </span>
      <span className="meta-divider">•</span>
      <span className="meta-item">
        <i className="fa-regular fa-calendar-days me-1" />
        {date}
      </span>
      <span className="meta-divider">•</span>
      <span className="meta-item">
        <i className="fa-solid fa-eye me-1" />
        {views} views
      </span>
    </div>
  );

  return (
    <>
      <style>{`
        .futuristic-news-section {
          padding: 100px 0;
          background: linear-gradient(135deg, #ffffff 0%, #fffef8 100%);
          position: relative;
          overflow: hidden;
        }

        .futuristic-news-section::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 215, 0, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 215, 0, 0.03) 0%, transparent 50%);
          pointer-events: none;
        }

        .section-header {
          text-align: center;
          margin-bottom: 60px;
          position: relative;
        }

        .section-header h2 {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 15px;
          position: relative;
          display: inline-block;
        }

        .section-header h2::after {
          content: '';
          position: absolute;
          bottom: -10px;
          left: 50%;
          transform: translateX(-50%);
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, transparent, #ffd700, transparent);
          border-radius: 2px;
        }

        .section-header p {
          color: #666;
          font-size: 1.1rem;
          max-width: 600px;
          margin: 20px auto 0;
        }

        .news-card {
          position: relative;
          border-radius: 20px;
          overflow: hidden;
          background: #ffffff;
          border: 1px solid rgba(255, 215, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          height: 100%;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }

        .news-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(255, 215, 0, 0.15);
          border-color: rgba(255, 215, 0, 0.3);
        }

        .news-card-image {
          position: relative;
          overflow: hidden;
          height: 280px;
        }

        .news-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .news-card:hover .news-card-image img {
          transform: scale(1.1);
        }

        .news-card-image::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.4) 100%);
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        .news-card:hover .news-card-image::after {
          opacity: 1;
        }

        .category-badges {
          position: absolute;
          top: 20px;
          left: 20px;
          z-index: 2;
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .category-badge {
          padding: 6px 14px;
          background: rgba(255, 215, 0, 0.95);
          color: #1a1a1a;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-decoration: none;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;
          border: 1px solid rgba(255, 215, 0, 0.3);
        }

        .category-badge:hover {
          background: #ffd700;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
        }

        .news-card-content {
          padding: 30px;
        }

        .news-card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 15px;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .news-card-title:hover {
          color: #ffd700;
        }

        .news-card-description {
          color: #666;
          font-size: 0.95rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }

        .read-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          color: #ffd700;
          font-weight: 600;
          text-decoration: none;
          font-size: 0.95rem;
          transition: all 0.3s ease;
          position: relative;
        }

        .read-more-btn::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 2px;
          background: #ffd700;
          transition: width 0.3s ease;
        }

        .read-more-btn:hover::after {
          width: calc(100% - 30px);
        }

        .read-more-btn i {
          transition: transform 0.3s ease;
        }

        .read-more-btn:hover i {
          transform: translateX(5px);
        }

        .meta-item {
          color: #999;
          font-size: 0.85rem;
          display: inline-flex;
          align-items: center;
        }

        .meta-item i {
          color: #ffd700;
        }

        .meta-divider {
          color: #ddd;
        }

        .side-news-card {
          display: flex;
          gap: 20px;
          padding: 20px;
          border-radius: 16px;
          background: #ffffff;
          border: 1px solid rgba(255, 215, 0, 0.08);
          transition: all 0.3s ease;
          margin-bottom: 20px;
        }

        .side-news-card:last-child {
          margin-bottom: 0;
        }

        .side-news-card:hover {
          transform: translateX(8px);
          box-shadow: 0 8px 24px rgba(255, 215, 0, 0.1);
          border-color: rgba(255, 215, 0, 0.2);
        }

        .side-news-image {
          flex-shrink: 0;
          width: 140px;
          height: 140px;
          border-radius: 12px;
          overflow: hidden;
        }

        .side-news-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s ease;
        }

        .side-news-card:hover .side-news-image img {
          transform: scale(1.1);
        }

        .side-news-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .side-news-title {
          font-size: 1.1rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 10px;
          line-height: 1.4;
          transition: color 0.3s ease;
        }

        .side-news-title:hover {
          color: #ffd700;
        }

        .side-news-description {
          color: #666;
          font-size: 0.85rem;
          line-height: 1.6;
          margin-bottom: 12px;
          flex-grow: 1;
        }

        @media (max-width: 1199px) {
          .side-news-image {
            width: 120px;
            height: 120px;
          }
        }

        @media (max-width: 767px) {
          .section-header h2 {
            font-size: 2rem;
          }

          .news-card-image {
            height: 220px;
          }

          .side-news-card {
            flex-direction: column;
          }

          .side-news-image {
            width: 100%;
            height: 200px;
          }
        }
      `}</style>

      <section className="futuristic-news-section">
        <div className="container">
          <div className="section-header">
            <h2>Latest News & Events</h2>
            <p>
              Stay updated with our latest stories, updates, and announcements
            </p>
          </div>

          <div className="row g-4">
            <div
              className="col-xl-6 col-lg-12"
              data-aos="fade-up"
              data-aos-delay={100}
            >
              <div className="news-card">
                <div className="news-card-image">
                  <img alt={mainNews.title} src={mainNews.image} />
                  <div className="category-badges">
                    {mainNews.categories.map((category, index) => (
                      <a key={index} href="#" className="category-badge">
                        {category}
                      </a>
                    ))}
                  </div>
                </div>
                <div className="news-card-content">
                  <h3 className="news-card-title">{mainNews.title}</h3>
                  <p className="news-card-description">
                    {mainNews.description}
                  </p>
                  <Link href="/single-blog" className="read-more-btn">
                    Read More
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                  <NewsMeta
                    author={mainNews.author}
                    date={mainNews.date}
                    views={mainNews.views}
                  />
                </div>
              </div>
            </div>

            <div
              className="col-xl-6 col-lg-12"
              data-aos="fade-up"
              data-aos-delay={200}
            >
              <div className="d-flex flex-column h-100">
                {sideNews.map((news, index) => (
                  <div key={index} className="side-news-card">
                    <div className="side-news-image">
                      <img alt={news.title} src={news.image} />
                    </div>
                    <div className="side-news-content">
                      <div
                        className="category-badges position-relative"
                        style={{ top: 0, left: 0 }}
                      >
                        {news.categories.map((category, catIndex) => (
                          <a key={catIndex} href="#" className="category-badge">
                            {category}
                          </a>
                        ))}
                      </div>
                      <h6 className="side-news-title mt-2">
                        <Link
                          href="/single-blog"
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {news.title}
                        </Link>
                      </h6>
                      <p className="side-news-description">
                        {news.description}
                      </p>
                      <NewsMeta
                        author={news.author}
                        date={news.date}
                        views={news.views}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NewsSection;
