import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/data/axiosData';
import Layout from '@/src/layouts/Layout';
import ProtectedCompanyRoute from '@/src/components/ProtectedCompanyRoute';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/companyAdmin/getAllOrders`, config);
        if (res.data.success) {
          setOrders(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <ProtectedCompanyRoute>
      <Layout>
        <div className="container py-5 min-vh-100">
          <h2 className="mb-4 fw-bold">Platform Orders</h2>
          <div className="table-responsive bg-white rounded-3 shadow-sm p-4">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Status</th>
                  <th>Total Amount</th>
                  <th>Customer ID</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>
                      <span className={`badge bg-${o.status === 'DELIVERED' ? 'success' : o.status === 'CONFIRMED' ? 'primary' : 'warning'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>₹{o.totalAmount}</td>
                    <td>{o.customerId}</td>
                  </tr>
                ))}
                {orders.length === 0 && (
                  <tr><td colSpan="4" className="text-center">No orders found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </ProtectedCompanyRoute>
  );
};
export default Orders;
