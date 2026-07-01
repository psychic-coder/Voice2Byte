import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/data/axiosData';
import Layout from '@/src/layouts/Layout';
import ProtectedCompanyRoute from '@/src/components/ProtectedCompanyRoute';
import Link from 'next/link';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const Dashboard = () => {
  const [stats, setStats] = useState({
    restaurants: 0,
    hotelAdmins: 0,
    orders: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resRes, resAdmins, resOrders] = await Promise.all([
          axios.get(`${BASE_URL}/api/companyAdmin/getAllRestaurants`, config),
          axios.get(`${BASE_URL}/api/companyAdmin/getAllHotelAdmins`, config),
          axios.get(`${BASE_URL}/api/companyAdmin/getAllOrders`, config)
        ]);

        setStats({
          restaurants: resRes.data.data?.length || 0,
          hotelAdmins: resAdmins.data.data?.length || 0,
          orders: resOrders.data.data?.length || 0
        });
      } catch (error) {
        console.error("Error fetching stats", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <ProtectedCompanyRoute>
      <Layout>
        <div className="container py-5 min-vh-100">
          <h2 className="fw-bold mb-4">Company Admin Dashboard</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-warning text-dark h-100 p-4">
                <h4>Total Restaurants</h4>
                <h1 className="display-4 fw-bold">{stats.restaurants}</h1>
                <Link href="/companyAdmin/restaurants" className="btn btn-outline-dark mt-3">View All</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-info text-dark h-100 p-4">
                <h4>Hotel Admins</h4>
                <h1 className="display-4 fw-bold">{stats.hotelAdmins}</h1>
                <Link href="/companyAdmin/admins" className="btn btn-outline-dark mt-3">View All</Link>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card shadow-sm border-0 bg-success text-white h-100 p-4">
                <h4>Total Orders</h4>
                <h1 className="display-4 fw-bold">{stats.orders}</h1>
                <Link href="/companyAdmin/orders" className="btn btn-outline-light mt-3">View All</Link>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedCompanyRoute>
  );
};

export default Dashboard;
