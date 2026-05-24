import { addOrder } from '@/redux/reducers/orderSlice';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ItemCard = ({ item }) => {
  const router = useRouter();
  const { id: restaurantId } = router.query;
  const dispatch = useDispatch();
  
  const { currentUser } = useSelector((state) => state.user);
  const { orders } = useSelector((state) => state.order);

  const handleCartUpdate = (item) => {
    if (!currentUser) {
      alert('Please login to add items to cart');
      return;
    }

    const orderItem = {
      itemId: item.id,
      itemName: item.name,
      itemPrice: item.price,
      quantity: 1, 
      restaurantId: restaurantId,
      userId: currentUser.user.id,
      image: item.image,
    };
    
    const existingItemIndex = orders.findIndex(
      order => order.itemId === item.id && order.restaurantId === restaurantId
    );

    if (existingItemIndex >= 0) {
      const updatedOrders = [...orders];
      updatedOrders[existingItemIndex] = orderItem;
      dispatch(addOrder(updatedOrders));
    } else {
      dispatch(addOrder([...orders, orderItem]));
    }
  };
  
  return (
    <div className="col-md-6 col-lg-4" data-aos="fade-up">
      <motion.div 
        className="card h-100 border-0 shadow-sm overflow-hidden"
        whileHover={{ y: -5 }}
      >
        <div className="position-relative" style={{ height: 200, overflow: 'hidden' }}>
          <img 
            src={item.image || "https://plus.unsplash.com/premium_photo-1694141251673-1758913ade48?q=80&w=3461&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
            alt={item.name}
            className="img-fluid w-100 h-100 object-fit-cover"
          />
          <div className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded-pill fw-bold">
            ${item.price.toFixed(2)}
          </div>
        </div>
        
        <div className="card-body">
          <h5 className="card-title text-dark">{item.name}</h5>
          <p className="card-text text-muted">{item.description}</p>
          
          <div className="d-flex flex-wrap gap-2 mb-3">
            {item.tags?.slice(0, 3).map(tag => (
              <span key={tag} className="badge bg-warning bg-opacity-20 text-warning-dark border border-warning border-opacity-25">
                {tag}
              </span>
            ))}
          </div>
          
          <button 
            className="btn btn-warning text-dark w-100 fw-bold"
            onClick={() => handleCartUpdate(item)}
          >
            Add to Order
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ItemCard;