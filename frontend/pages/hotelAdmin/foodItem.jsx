import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/data/axiosData';
import { useRouter } from 'next/navigation';
import 'bootstrap/dist/css/bootstrap.min.css';
import { motion } from 'framer-motion';
import Layout from '@/src/layouts/Layout';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/api` : 'http://localhost:4000/api';

const FoodItems = () => {
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/hotelAdmin/getAllFoodItems`, config);
      if (response.data.success) {
        setFoodItems(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching food items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this food item?');
    if (!confirmDelete) return;

    try {
      await axios.delete(`${BASE_URL}/hotelAdmin/deleteFoodItem/${id}`, config);
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting food item:', error);
      alert('Failed to delete the food item.');
    }
  };

  const handleClick = (id) => {
    router.push(`/hotelAdmin/foodUpdate?itemId=${id}`);
  };

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
      scale: 1.03,
      transition: {
        duration: 0.3
      }
    }
  };

  return (
    
    <div className="container-fluid py-4" style={{ backgroundColor: '#fffef0', minHeight: '100vh' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-center mb-5 fw-bold" style={{ color: '#ffc107' }}>
          All Food Items
        </h1>
      </motion.div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <motion.div
          className="row g-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {foodItems.map((item) => (
            <motion.div
              key={item.id}
              className="col-md-4 col-lg-3"
              variants={itemVariants}
              whileHover="hover"
            >
              <div 
                className="card h-100 border-0 shadow-sm overflow-hidden position-relative"
                style={{ borderRadius: '15px', cursor: 'pointer' }}
                onClick={() => handleClick(item.id)}
              >
                <div className="card-img-top overflow-hidden" style={{ height: '200px' }}>
                  <img
                    src="https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=900&auto=format&fit=crop&q=60"
                    alt={item.name}
                    className="img-fluid w-100 h-100 object-fit-cover"
                  />
                  <div className="position-absolute top-0 end-0 bg-warning px-2 py-1 rounded-bl">
                    <span className="fw-bold">₹{item.price}</span>
                  </div>
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold text-dark">{item.name}</h5>
                  <p className="card-text text-muted small">{item.description}</p>
                  <div className="d-flex flex-wrap gap-1 mb-3">
                    {item.tags.map((tag, index) => (
                      <span key={index} className="badge bg-warning bg-opacity-25 text-dark">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="card-footer bg-transparent border-0">
                  <button
                    className="btn btn-outline-danger btn-sm w-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

FoodItems.getLayout = (page) => <Layout>{page}</Layout>;

export default FoodItems;