import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { signOutSuccess } from '@/redux/reducers/userslice';
import axios from 'axios';
import { config } from '@/data/axiosData';
import Layout from '../layouts/Layout';
import CustomerProfileOrderSection from './CustomerProfileOrderSection';
import ProfileInfoSection from './ProfileInfoSection';
import AccountOverviewCard from './AccountOverviewCard';

const CustomerProfile = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    address: '',
    photoUrl: '',
    role: '',
    createdAt: '',
    orders: []
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    photoUrl: ''
  });
  const [tempPhoto, setTempPhoto] = useState(null);

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get('http://localhost:4000/api/customer/me', config);
       
        setCustomerData(res.data.customer);
        setFormData({
          name: res.data.customer.name,
          email: res.data.customer.email,
          address: res.data.customer.address,
          photoUrl: res.data.customer.photoUrl
        });
        setIsLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch customer data');
        setIsLoading(false);
      }
    };

    fetchCustomerData();
  }, []);

  
  

  const handleSignOut = () => {
    router.push('/signin');
    dispatch(signOutSuccess());
    
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="d-flex justify-content-center align-items-center min-vh-100">
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" style={{width: '3rem', height: '3rem'}} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted fs-5">Loading your profile...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container py-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger border-0 shadow-sm rounded-4">
                <div className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill fs-4 me-3"></i>
                  <div>
                    <h6 className="alert-heading mb-1">Something went wrong</h6>
                    <p className="mb-0">{error}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="bg-light min-vh-100" style={{paddingTop: '10px'}}>
        {/* Header Section */}
        <div className="bg-warning bg-gradient position-relative overflow-hidden">
          <div className="position-absolute top-0 end-0 w-50 h-100 opacity-10">
            <svg viewBox="0 0 200 200" className="w-100 h-100">
              <circle cx="150" cy="50" r="80" fill="white" opacity="0.1"/>
              <circle cx="50" cy="150" r="60" fill="white" opacity="0.15"/>
            </svg>
          </div>
          <div className="container py-5 position-relative">
            <div className="row align-items-center">
              <div className="col-auto">
                <div className="position-relative">
                  <img 
                    src={ customerData.photoUrl} 
                    alt="Profile" 
                    className="rounded-circle border border-4 border-white shadow-lg"
                    width="120"
                    height="120"
                    style={{ objectFit: 'cover' }}
                  />
                  <div className="position-absolute bottom-0 end-0 bg-success rounded-circle p-2 border border-3 border-white">
                    <i className="bi bi-check-lg text-white"></i>
                  </div>
                </div>
              </div>
              <div className="col">
                <h1 className="text-white mb-2 fw-bold">{customerData.name}</h1>
                <p className="text-white-50 mb-2 fs-5">
                  <i className="bi bi-envelope me-2"></i>
                  {customerData.email}
                </p>
                <p className="text-white-50 mb-3">
                  <i className="bi bi-geo-alt me-2"></i>
                  {customerData.address}
                </p>
                <div className="d-flex gap-2 flex-wrap">
                  <span className="badge bg-white text-warning fs-6 px-3 py-2 rounded-pill">
                    <i className="bi bi-person-badge me-1"></i>
                    {customerData.role}
                  </span>
                  <span className="badge bg-success bg-opacity-25 text-white fs-6 px-3 py-2 rounded-pill">
                    <i className="bi bi-calendar-check me-1"></i>
                    Member since {new Date(customerData.createdAt).getFullYear()}
                  </span>
                </div>
              </div>
               <div className="col-auto">
                <div className="d-flex gap-2 flex-column flex-sm-row">
                      <button 
                        className="btn btn-outline-light rounded-pill px-4 fw-semibold"
                        onClick={handleSignOut}
                        disabled={isLoading}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Sign Out
                      </button>
                
                </div>
              </div> 
            </div>
          </div>
        </div>

        <div className="container py-5">
          <div className="row g-4">
            {/* Profile Information Card */}
            <ProfileInfoSection/>

            {/* Quick Stats Sidebar */}
            <AccountOverviewCard/>

            {/* Orders Section */}
            <CustomerProfileOrderSection/>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CustomerProfile;