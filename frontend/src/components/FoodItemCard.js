import styles from '../../styles/search.module.css';

const FoodItemCard = ({ item, navigateToFoodItem }) => {
  return (
    <div className="col-md-6 col-lg-4 col-xl-3">
      <div 
        className={`card h-100 border-0 shadow-sm overflow-hidden ${styles.foodCard}`}
        onClick={() => navigateToFoodItem(item.hotelId, item.itemId)}
        style={{ cursor: 'pointer' }}
      >
        <div className={styles.foodImageContainer}>
          <img 
            src={'https://images.unsplash.com/photo-1542367592-8849eb950fd8?q=80&w=3431&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
            alt={item.itemName}
            className={`card-img-top ${styles.foodImage}`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image'
            }}
          />
        </div>
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-start mb-2">
            <h6 className="card-title mb-0">{item.itemName}</h6>
            <span className="text-warning fw-bold">₹{item.itemPrice}</span>
          </div>
          <p className="small text-muted mb-2">From: {item.hotelName}</p>
          <div className="d-flex flex-wrap gap-1">
            {item.itemTags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="badge bg-light text-dark border small">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodItemCard;