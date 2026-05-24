import Link from "next/link";
import { motion } from "framer-motion";

const RestaurantHeroSection = ({ restaurant }) => {
  return (
    <section className="hero-section position-relative overflow-hidden">
      <div 
        className="hero-background position-absolute w-100 h-100"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.7)'
        }}
      />
      
      <div className="container position-relative z-index-1 py-5">
        <div className="row align-items-center min-vh-75 py-5">
          <div className="col-lg-6 py-5" data-aos="fade-right">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <Link href="/" className="text-white text-decoration-none">Home</Link>
                </li>
                <li className="breadcrumb-item">
                  <Link href="/restaurants" className="text-white text-decoration-none">Restaurants</Link>
                </li>
                <li className="breadcrumb-item active text-white">
                  {restaurant.name}
                </li>
              </ol>
            </nav>
            
            <div className="d-flex align-items-center mb-4">
              <div className="rounded-circle bg-white p-2 me-3">
                <img 
                  src={restaurant.image || "https://quickeat-react.vercel.app/assets/img/logos-2.jpg"} 
                  alt="Restaurant" 
                  className="img-fluid rounded-circle"
                  style={{ width: 60, height: 60, objectFit: 'cover' }}
                />
              </div>
              <h1 className="text-white mb-0">{restaurant.name}</h1>
            </div>
            
            <div className="bg-warning bg-opacity-10 p-4 rounded-3 backdrop-blur border border-warning border-opacity-25">
              <div className="d-flex align-items-center mb-3">
                <span className="text-white me-3">Rating:</span>
                <div className="text-warning">
                  {[...Array(5)].map((_, i) => (
                    <i 
                      key={i} 
                      className={`fas fa-star${i < Math.floor(restaurant.rating) ? '' : '-half-alt'}`}
                    />
                  ))}
                </div>
              </div>
              
              <div className="mb-3">
                <span className="text-white me-2">Cuisines:</span>
                <div className="d-flex flex-wrap gap-2">
                  {restaurant.category?.length > 0 ? (
                    restaurant.category.map(cat => (
                      <span key={cat} className="badge bg-warning bg-opacity-25 text-white">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="badge bg-warning bg-opacity-25 text-white">
                      Indian
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <span className="text-white">Description:</span>
                <p className="text-white-50 mb-0">
                  {restaurant.desc !== "No description available" 
                    ? restaurant.desc 
                    : "Experience authentic flavors in a cozy atmosphere."}
                </p>
              </div>
            </div>
          </div>
          
          <div className="col-lg-6" data-aos="fade-left">
            <div className="position-relative">
              <img
                src={restaurant.image || "https://quickeat-react.vercel.app/assets/img/restaurant-1.jpg"}
                alt={restaurant.name}
                className="img-fluid rounded-4 shadow-lg"
              />
              
              <motion.div 
                className="position-absolute bottom-0 start-0 bg-warning p-3 rounded-3 m-3 shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="d-flex align-items-center">
                  <i className="far fa-clock text-white fs-4 me-3" />
                  <div>
                    <h6 className="mb-0 text-white">9am – 12pm</h6>
                    <small className="text-white-50">Hours</small>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="position-absolute bottom-0 end-0 bg-warning p-3 rounded-3 m-3 shadow-sm"
                whileHover={{ scale: 1.05 }}
              >
                <div className="d-flex align-items-center">
                  <i className="fas fa-utensils text-white fs-4 me-3" />
                  <div>
                    <h6 className="mb-0 text-white">Breakfast, Lunch, Dinner</h6>
                    <small className="text-white-50">Meals</small>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantHeroSection;