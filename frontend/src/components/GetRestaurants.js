import { useRouter } from "next/navigation";
import React from "react";

const GetRestaurants = ({ restaurants }) => {
    const router=useRouter()
  const handleCardClick = (id) => {
    router.push(`/restaurant-card?id=${id}`)
  };

  
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating || 0);
    const hasHalfStar = (rating || 0) % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<i key={i} className="fas fa-star text-warning"></i>);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<i key={i} className="fas fa-star-half-alt text-warning"></i>);
      } else {
        stars.push(<i key={i} className="far fa-star text-warning"></i>);
      }
    }
    return stars;
  };

  return (
    <section className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center mb-5 display-5 fw-bold">
          Discover Amazing Restaurants
        </h2>
        
        <div className="row g-4">
          {restaurants.map((restaurant) => (
            <div 
              key={restaurant.id} 
              className="col-md-6 col-lg-4"
              data-aos="fade-up"
            >
              <div 
                className="card h-100 border-0 shadow-sm hover-shadow transition-all"
                onClick={() => handleCardClick(restaurant.id)}
                role="button"
              >
                {/* Restaurant Image */}
                <div className="ratio ratio-16x9">
                  <img
                    src={"https://quickeat-react.vercel.app/assets/img/logos-2.jpg" || "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"}
                    alt={restaurant.name}
                    className="card-img-top object-fit-cover"
                    loading="lazy"
                  />
                </div>

                {/* Restaurant Info */}
                <div className="card-body">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <h3 className="card-title h5 mb-0">
                      {restaurant.name}
                    </h3>
                    <span className="badge bg-primary rounded-pill">
                      {restaurant.rating?.toFixed(1) || "N/A"} 
                      <i className="fas fa-star ms-1 text-white"></i>
                    </span>
                  </div>

                  {/* Location and Contact */}
                  <div className="d-flex align-items-center text-muted mb-2">
                    <i className="fas fa-map-marker-alt text-danger me-2"></i>
                    <small>{restaurant.address || "Location not specified"}</small>
                  </div>
                  <div className="d-flex align-items-center text-muted mb-3">
                    <i className="fas fa-phone text-success me-2"></i>
                    <small>{restaurant.phone || "Contact not available"}</small>
                  </div>

                  {/* Description */}
                  <p className="card-text text-secondary mb-3 line-clamp-2">
                    {restaurant.desc || "No description available"}
                  </p>

                  {/* Tags */}
                  {restaurant.hotelTags?.length > 0 && (
                    <div className="mb-3">
                      {restaurant.hotelTags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index} 
                          className="badge bg-info bg-opacity-10 text-info me-1 mb-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Star Rating */}
                  <div className="d-flex align-items-center mb-3">
                    <div className="me-2">
                      {renderStars(restaurant.rating || 0)}
                    </div>
                    <small className="text-muted">
                      ({restaurant.ratingCount || 0} reviews)
                    </small>
                  </div>

                  {/* Categories */}
                  {restaurant.category?.length > 0 && (
                    <div className="pt-3 border-top">
                      <div className="d-flex align-items-center">
                        <i className="fas fa-utensils text-orange me-2"></i>
                        <div>
                          {restaurant.category.slice(0, 3).map((cat, index) => (
                            <small key={index} className="text-muted me-2">
                              {cat}
                            </small>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GetRestaurants;