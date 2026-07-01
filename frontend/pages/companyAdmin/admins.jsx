import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { config } from '@/data/axiosData';
import Layout from '@/src/layouts/Layout';
import ProtectedCompanyRoute from '@/src/components/ProtectedCompanyRoute';

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:4000';

const Admins = () => {
  const [admins, setAdmins] = useState([]);

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/companyAdmin/getAllHotelAdmins`, config);
        if (res.data.success) {
          setAdmins(res.data.data);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchAdmins();
  }, []);

  return (
    <ProtectedCompanyRoute>
      <Layout>
        <div className="container py-5 min-vh-100">
          <h2 className="mb-4 fw-bold">Manage Hotel Admins</h2>
          <div className="table-responsive bg-white rounded-3 shadow-sm p-4">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {admins.map(a => (
                  <tr key={a.id}>
                    <td>{a.name}</td>
                    <td>{a.email}</td>
                    <td>{new Date(a.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
                {admins.length === 0 && (
                  <tr><td colSpan="3" className="text-center">No admins found.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </Layout>
    </ProtectedCompanyRoute>
  );
};
export default Admins;
