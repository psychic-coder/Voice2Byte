import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/data/axiosData';

const BASE_URL = 'http://localhost:4000/api'; // Replace with actual base URL

const FoodItems = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/hotelAdmin/getAllFoodItems`,config);
      console.log(response);
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
    const confirm = window.confirm('Are you sure you want to delete this food item?');
    if (!confirm) return;

    try {
      await axios.delete(`${BASE_URL}/hotelAdmin/deleteFoodItem/${id}`,config);
      setFoodItems(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error('Error deleting food item:', error);
      alert('Failed to delete the food item.');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>All Food Items</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={styles.grid}>
          {foodItems.map((item) => (
            <div key={item.id} style={styles.card}>
              <img src={"https://images.unsplash.com/photo-1542367592-8849eb950fd8?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8aW5kaWFuJTIwZm9vZHxlbnwwfHwwfHx8MA%3D%3D"} alt={item.name} style={styles.image} />
              <div style={styles.details}>
                <h2 style={styles.name}>{item.name}</h2>
                <p style={styles.description}>{item.description}</p>
                <p style={styles.price}>₹{item.price}</p>
                <p style={styles.tags}>{item.tags.join(', ')}</p>
                <button style={styles.deleteButton} onClick={() => handleDelete(item.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#fffef0',
    minHeight: '100vh',
    fontFamily: 'sans-serif',
  },
  title: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fbbf24',
    marginBottom: '1rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  card: {
    border: '1px solid #facc15',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
  },
  details: {
    padding: '1rem',
    flex: 1,
  },
  name: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#d97706',
  },
  description: {
    fontSize: '0.9rem',
    color: '#4b5563',
    margin: '0.5rem 0',
  },
  price: {
    fontWeight: 'bold',
    color: '#10b981',
  },
  tags: {
    fontSize: '0.8rem',
    color: '#9ca3af',
    margin: '0.5rem 0',
  },
  deleteButton: {
    marginTop: '0.5rem',
    padding: '0.5rem 1rem',
    backgroundColor: '#facc15',
    color: '#000',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontWeight: '600',
  },
};

export default FoodItems;
