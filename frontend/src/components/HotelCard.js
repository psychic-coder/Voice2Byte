import styles from '../../styles/search.module.css';

const HotelCard = ({ hotel, navigateToHotel }) => {
  return (
    <div className="col-md-6 col-lg-4">
      <div 
        className={`card h-100 border-0 shadow-sm overflow-hidden ${styles.hotelCard}`}
        onClick={() => navigateToHotel(hotel.restaurantId)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.cardImagePlaceholder}>
          <div className={styles.imageOverlay}></div>
          <div className={styles.ratingBadge}>
            {hotel.rating > 0 ? (
              <span className="badge bg-warning text-dark">
                <i className="bi bi-star-fill me-1"></i>
                {hotel.rating.toFixed(1)}
              </span>
            ) : (
              <span className="badge bg-secondary">New</span>
            )}
          </div>
        </div>
        <div className="card-body">
          <h5 className="card-title">{hotel.restaurantName}</h5>
          <p className="card-text text-muted small mb-2">{hotel.restaurantDescription}</p>
          <div className="d-flex flex-wrap gap-1 mb-2">
            {hotel.restaurantCategories.slice(0, 3).map((category, idx) => (
              <span key={idx} className="badge bg-light text-dark border">
                {category}
              </span>
            ))}
          </div>
          <div className="d-flex align-items-center text-muted small">
            <i className="bi bi-geo-alt me-1"></i>
            <span>{hotel.restaurantAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelCard;