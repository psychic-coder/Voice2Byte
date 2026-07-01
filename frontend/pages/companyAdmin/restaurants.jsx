import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/data/axiosData';
import Layout from '@/src/layouts/Layout';
import ProtectedCompanyRoute from '@/src/components/ProtectedCompanyRoute';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/companyAdmin/getAllRestaurants`, config);
      if (res.data.success) {
        setRestaurants(res.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this restaurant?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/companyAdmin/deleteRestaurant/${id}`, config);
      setRestaurants(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ProtectedCompanyRoute>
      <Layout>
        <div className="container py-5 min-vh-100">
          <h2 className="mb-4 fw-bold">Manage Restaurants</h2>
          <div className="table-responsive bg-white rounded-3 shadow-sm p-4">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>City/Location</th>
                  <th>Rating</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(r => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.location}</td>
                    <td>{r.rating || 'N/A'}</td>
                    <td>
                      <button onClick={() => handleDelete(r.id)} className="btn btn-sm btn-danger">Delete</button>
                    </td>
                  </tr>
                ))}
                {restaurants.length === 0 && (
                  <tr><td colSpan="4" className="text-center">No restaurants found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </ProtectedCompanyRoute>
  );
};
export default Restaurants;
