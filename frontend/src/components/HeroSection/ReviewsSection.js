import { Swiper, SwiperSlide } from "swiper/react";
import { sliderProps } from "@/src/sliderProps";

const ReviewsSection = () => {
  const reviews = [
    {
      text: "Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Mauris a diam maecenas sed enim. Egestas diam in arcu cursus euismod quis. Quam quisque id diam vel.",
      name: "Thomas Adamson",
      image: "https://quickeat-react.vercel.app/assets/img/photo-5.jpg",
      rating: 5,
    },
    {
      text: "Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Mauris a diam maecenas sed enim. Egestas diam in arcu cursus euismod quis. Quam quisque id diam vel.",
      name: "Thomas Adamson",
      image: "https://quickeat-react.vercel.app/assets/img/photo-5.jpg",
      rating: 5,
    },
    {
      text: "Dapibus ultrices in iaculis nunc sed augue lacus viverra vitae. Mauris a diam maecenas sed enim. Egestas diam in arcu cursus euismod quis. Quam quisque id diam vel.",
      name: "Thomas Adamson",
      image: "https://quickeat-react.vercel.app/assets/img/photo-5.jpg",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 0; i < rating; i++) {
      stars.push(<i key={i} className="fa-solid fa-star" />);
    }
    return stars;
  };

  return (
    <section className="reviews-sections gap">
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-xl-6 col-lg-12"
            data-aos="fade-up"
            data-aos-delay={200}
            data-aos-duration={300}
          >
            <div className="reviews-content">
              <h2>What customers say about us</h2>
              <div className="custome owl-carousel">
                <Swiper {...sliderProps.index1Testmoninal}>
                  {reviews.map((review, index) => (
                    <SwiperSlide key={index} className="item">
                      <h4>"{review.text}"</h4>
                      <div className="thomas">
                        <img alt="girl" src={review.image} />
                        <div>
                          <h6>{review.name}</h6>
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
                <div className="owl-nav mt-4">
                  <button className="owl-prev">
                    <i className="fa-solid fa-arrow-left"></i>
                  </button>
                  <button className="owl-next ms-3">
                    <i className="fa-solid fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-12"
            data-aos="fade-up"
            data-aos-delay={300}
            data-aos-duration={400}
          >
            <div className="reviews-img">
              <img
                alt="photo"
                src="https://quickeat-react.vercel.app/assets/img/photo-4.png"
              />
              <i className="fa-regular fa-thumbs-up" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
