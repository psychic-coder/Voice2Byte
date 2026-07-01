import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Spinner, Button, Card, Badge } from 'react-bootstrap';
import { config } from '@/data/axiosData';
import { motion, AnimatePresence } from 'framer-motion';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:4000/api';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotelProfile();
  }, []);

  const fetchHotelProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/hotelAdmin/me`, config);
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
      await axios.get(`${BASE_URL}/hotelAdmin/${orderId}/confirmOrder/${status}`, config);
      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Status badge colors
  const getStatusVariant = (status) => {
    switch (status) {
      case 'PENDING': return 'warning';
      case 'CONFIRMED': return 'primary';
      case 'DELIVERED': return 'success';
      case 'REJECTED': return 'danger';
      default: return 'secondary';
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    },
    hover: {
      scale: 1.02,
      boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container py-5 min-vh-100"
      style={{ backgroundColor: '#fffef0' }}
    >
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-warning mb-4 fw-bold">
          <i className="bi bi-clock-history me-2"></i>
          Recent Orders
        </h2>
      </motion.div>

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="grow" variant="warning" />
          <p className="mt-3 text-warning">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-5"
        >
          <div className="display-4 text-muted mb-3">
            <i className="bi bi-inbox"></i>
          </div>
          <h4 className="text-warning">No recent orders found</h4>
          <p className="text-muted">New orders will appear here</p>
        </motion.div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="row g-4"
        >
          {orders.map(order => (
            <motion.div
              key={order.id}
              variants={itemVariants}
              whileHover="hover"
              className="col-md-6 col-lg-4"
            >
              <Card className="h-100 border-0 shadow-sm overflow-hidden">
                <Card.Header className={`bg-${getStatusVariant(order.status)} text-white d-flex justify-content-between`}>
                  <span className="fw-bold">Order #{order.id}</span>
                  <Badge pill bg="light" text={getStatusVariant(order.status)}>
                    {order.status}
                  </Badge>
                </Card.Header>
                <Card.Body>
                  <Card.Subtitle className="mb-3 d-flex justify-content-between">
                    <span className="text-muted">Total:</span>
                    <span className="fw-bold text-warning">₹{order.totalAmount.toFixed(2)}</span>
                  </Card.Subtitle>
                  
                  <div className="mb-3">
                    <h6 className="fw-bold text-warning mb-2">
                      <i className="bi bi-basket me-2"></i>
                      Items:
                    </h6>
                    <ul className="list-group list-group-flush">
                      {order.items.map((item, index) => (
                        <li key={index} className="list-group-item bg-transparent d-flex justify-content-between py-2 px-0">
                          <span>
                            <span className="badge bg-warning text-dark me-2">{item.quantity}</span>
                            {item.name}
                          </span>
                          <span className="text-muted">₹{item.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {order.status === 'PENDING' && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="d-flex flex-wrap gap-2 mt-3"
                    >
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'CONFIRMED')}
                          className="flex-grow-1"
                        >
                          <i className="bi bi-check-circle me-1"></i> Confirm
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'DELIVERED')}
                          className="flex-grow-1"
                        >
                          <i className="bi bi-truck me-1"></i> Deliver
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }}>
                        <Button
                          variant="danger"
                          size="sm"
                          onClick={() => handleStatusChange(order.id, 'REJECTED')}
                          className="flex-grow-1"
                        >
                          <i className="bi bi-x-circle me-1"></i> Reject
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </Card.Body>
                <Card.Footer className="text-muted small bg-transparent border-0">
                  <i className="bi bi-clock me-1"></i>
                  {new Date(order.createdAt).toLocaleString()}
                </Card.Footer>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentOrders;