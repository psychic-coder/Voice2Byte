// components/OrderSection.jsx
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

const OrderSection = () => {
    const [orders,setOrders]=useState([])
  const { currentUser } = useSelector((state) => state.user);
useEffect(()=>{
    setOrders(currentUser.user.orders);
},[])


  const handleReorder = (order) => {
    console.log('Reordering:', order);

  };


  const handleViewDetails = (orderId) => {
    console.log('Viewing details for order:', orderId);
  };

  if (!currentUser) return <div>Loading user data...</div>;

  return (
    <div className="customer-orders-section p-4">
      <h3 className="mb-4">Your Orders</h3>
      
      {orders?.length === 0 ? (
        <div className="alert alert-info">
          You haven't placed any orders yet.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Order </th>
                <th>Date</th>
                <th>Restaurant</th>
                <th>Status</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders?.map((order) => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{format(new Date(order.createdAt), 'PPp')}</td>
                  <td>Restaurant {order.restaurantId}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status.toLowerCase()}
                    </span>
                  </td>
                  <td>${order.totalAmount.toFixed(2)}</td>
                  <td>
                    <button 
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleViewDetails(order.id)}
                    >
                      Details
                    </button>
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleReorder(order)}
                      disabled={order.status === 'CANCELLED'}
                    >
                      Reorder
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


const getStatusBadgeClass = (status) => {
  switch(status.toLowerCase()) {
    case 'confirmed':
      return 'bg-success';
    case 'pending':
      return 'bg-warning text-dark';
    case 'cancelled':
      return 'bg-danger';
    case 'delivered':
      return 'bg-info';
    default:
      return 'bg-secondary';
  }
};

export default OrderSection;