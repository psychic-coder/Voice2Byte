import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Spinner, Button, Card, Badge } from 'react-bootstrap';
import { config } from '@/data/axiosData';

const BASE_URL = 'http://localhost:4000/api'; 

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelProfile();
  }, []);

  const fetchHotelProfile = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/hotelAdmin/me`,config);
      if (response.data.success) {
        setOrders(response.data.profile.restaurant.recentOrders);
      }
    } catch (error) {
      console.error('Error fetching hotel profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await axios.get(`${BASE_URL}/hotelAdmin/${orderId}/confirmOrder/${status}`,config);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container py-5 bg-light min-vh-100">
      <h2 className="text-warning mb-4">Recent Orders</h2>
      {loading ? (
        <Spinner animation="border" variant="warning" />
      ) : orders.length === 0 ? (
        <p>No recent orders found.</p>
      ) : (
        <div className="row g-4">
          {orders.map(order => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <Card className="shadow-sm h-100">
                <Card.Body>
                  <Card.Title>
                    Order #{order.id}{' '}
                    <Badge bg={
                      order.status === 'PENDING'
                        ? 'warning'
                        : order.status === 'CONFIRMED'
                        ? 'primary'
                        : order.status === 'DELIVERED'
                        ? 'success'
                        : 'danger'
                    }>
                      {order.status}
                    </Badge>
                  </Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    Total: ₹{order.totalAmount.toFixed(2)}
                  </Card.Subtitle>
                  <p className="mb-1"><strong>Items:</strong></p>
                  <ul className="list-unstyled mb-2">
                    {order.items.map((item, index) => (
                      <li key={index}>
                        {item.quantity} x {item.name} @ ₹{item.price}
                      </li>
                    ))}
                  </ul>
                  {order.status === 'PENDING' && (
                    <div className="d-flex flex-wrap gap-2">
                      <Button
                        variant="primary"
                        onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                      >
                        Confirm
                      </Button>
                      <Button
                        variant="success"
                        onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                      >
                        Deliver
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => handleStatusChange(order.id, 'REJECTED')}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentOrders;
