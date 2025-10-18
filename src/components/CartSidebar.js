import { clearOrders, deleteOrder, updateQuantity } from '@/redux/reducers/orderSlice';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';

const CartSidebar = ({ showCart, setShowCart }) => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { orders } = useSelector((state) => state.order);

  const totalPrice = orders.reduce(
    (sum, item) => sum + item.itemPrice * item.quantity,
    0
  );

  const handleQuantityChange = (itemId, change) => {
    const item = orders.find((order) => order.itemId === itemId);
    if (!item) return;

    const newQuantity = item.quantity + change;

    if (newQuantity <= 0) {
      dispatch(deleteOrder(itemId));
    } else {
      dispatch(updateQuantity({ itemId, quantity: newQuantity }));
    }
  };

  const onCheckout = () => {
    router.push("/checkout");
  };

  return (
    <>
      {showCart && (
        <div className="position-fixed top-0 end-0 min-vh-100 w-100" style={{ zIndex: 50 }}>
          <div 
            className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            onClick={() => setShowCart(false)}
          />
          
          <motion.div 
            className="position-absolute top-0 end-0 h-100 bg-white shadow-lg"
            style={{ width: '450px', maxWidth: '90%' }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            
            <div className="d-flex justify-content-between align-items-center p-3 border-bottom bg-warning bg-opacity-10">
              <h4 className="mb-0 text-dark fw-bold">
                <i className="fas fa-shopping-bag me-2"></i>
                Your Food Cart
              </h4>
              <button 
                className="btn btn-sm btn-warning rounded-circle"
                onClick={() => setShowCart(false)}
                aria-label="Close cart"
                style={{ width: '32px', height: '32px' }}
              >
                <i className="fas fa-times" />
              </button>
            </div>
            
           
            <div className="p-3" style={{ height: 'calc(100% - 200px)', overflowY: 'auto' }}>
              {orders.length === 0 ? (
                <div className="text-center py-5">
                  <i className="fas fa-shopping-cart fa-4x text-warning mb-3 opacity-50" />
                  <p className="text-muted fs-5">Your cart feels lonely</p>
                  <button 
                    className="btn btn-outline-warning mt-2"
                    onClick={() => setShowCart(false)}
                  >
                    Browse Menu
                  </button>
                </div>
              ) : (
                <ul className="list-group list-group-flush">
                  {orders.map((item) => (
                    <li key={item.itemId} className="list-group-item border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <div className="d-flex align-items-center">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.itemName}
                              className="rounded-3 me-3 shadow-sm"
                              style={{ 
                                width: '60px', 
                                height: '60px', 
                                objectFit: 'cover',
                                border: '2px solid rgba(255, 193, 7, 0.3)'
                              }}
                            />
                          ) : (
                            <div 
                              className="rounded-3 me-3 d-flex align-items-center justify-content-center bg-warning bg-opacity-10 text-warning"
                              style={{ 
                                width: '60px', 
                                height: '60px',
                                border: '2px dashed rgba(255, 193, 7, 0.3)'
                              }}
                            >
                              <i className="fas fa-utensils"></i>
                            </div>
                          )}
                          <div>
                            <h6 className="mb-1 fw-bold text-dark">{item.itemName}</h6>
                            <small className="text-muted d-block">
                              ${item.itemPrice.toFixed(2)}
                            </small>
                          </div>
                        </div>
                        <div className="d-flex align-items-center">
                          <span className="me-3 fw-bold">
                            ${(item.itemPrice * item.quantity).toFixed(2)}
                          </span>
                          <div className="btn-group btn-group-sm shadow-sm">
                            <button 
                              className="btn btn-outline-warning"
                              onClick={() => handleQuantityChange(item.itemId, -1)}
                              aria-label={`Remove one ${item.itemName}`}
                            >
                              <i className="fas fa-minus" />
                            </button>
                            <span className="btn bg-warning bg-opacity-10 text-dark px-3">
                              {item.quantity}
                            </span>
                            <button 
                              className="btn btn-outline-warning"
                              onClick={() => handleQuantityChange(item.itemId, 1)}
                              aria-label={`Add one more ${item.itemName}`}
                            >
                              <i className="fas fa-plus" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
           {/* footer */}
            <div className="position-absolute bottom-0 start-0 end-0 p-3 border-top bg-white">
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Subtotal:</span>
                <span className="fw-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-muted">Tax (10%):</span>
                <span className="fw-bold">${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-3">
                <span className="text-dark fw-bold">Total:</span>
                <span className="text-dark fw-bold fs-5">${(totalPrice * 1.1).toFixed(2)}</span>
              </div>
              <button 
                className="btn btn-warning w-100 py-2 fw-bold shadow-sm"
                disabled={orders.length === 0}
                onClick={onCheckout}
                style={{
                  background: 'linear-gradient(to right, #ffc107, #ffab00)',
                  border: 'none',
                  fontSize: '1.1rem'
                }}
              >
                <i className="fas fa-credit-card me-2"></i>
                Proceed to Checkout
              </button>
              
              {orders.length > 0 && (
                <button 
                  className="btn btn-link text-warning w-100 mt-2"
                  onClick={() => dispatch(clearOrders())}
                >
                  <i className="fas fa-trash-alt me-1"></i>
                  Clear Cart
                </button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default CartSidebar;