import { useState, useEffect } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { config } from '@/data/axiosData';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photoUrl: ''
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/companyAdmin/me', config);
        setAdminData(response.data.admin);
        setFormData({
          name: response.data.admin.name,
          photoUrl: response.data.admin.photoUrl
        });
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch admin profile');
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        'http://localhost:4000/api/companyAdmin/me',
        formData,
        config
      );
      setAdminData(response.data.admin);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return <div className="d-flex justify-content-center mt-5"><div className="spinner-border text-warning" role="status"></div></div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!adminData) return <div className="alert alert-warning mt-3">No admin data found</div>;

  return (
    <>
      <Head>
        <title>Company Admin Profile </title>
        <meta name="description" content="Company Admin Profile Page" />
      </Head>

      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 mb-4">
              <div className="card-body text-center">
                <div className="position-relative d-inline-block">
                  <img 
                    src={"https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?q=80&w=3435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"} 
                    alt="Admin" 
                    className="rounded-circle shadow" 
                    width="150" 
                    height="150"
                  />
                  {editMode && (
                    <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm">
                      <label htmlFor="photoUpload" className="mb-0 cursor-pointer">
                        <i className="bi bi-camera-fill text-warning fs-5"></i>
                      </label>
                      <input 
                        type="file" 
                        id="photoUpload" 
                        className="d-none" 
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              setFormData(prev => ({
                                ...prev,
                                photoUrl: reader.result
                              }));
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </div>
                  )}
                </div>
                <h3 className="mt-3 mb-0">{adminData.name}</h3>
                <p className="text-muted mb-2">{adminData.role.replace('_', ' ')}</p>
                
                {!editMode && (
                  <button 
                    onClick={() => setEditMode(true)}
                    className="btn btn-warning btn-sm px-4 rounded-pill"
                  >
                    Edit Profile
                  </button>
                )}
              </div>
            </div>

            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <h5 className="card-title text-warning">Account Details</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <i className="bi bi-envelope-fill text-warning me-2"></i>
                    {adminData.email}
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-calendar-check-fill text-warning me-2"></i>
                    Member since {new Date(adminData.createdAt).toLocaleDateString()}
                  </li>
                  <li>
                    <i className="bi bi-check-circle-fill text-warning me-2"></i>
                    {adminData.profileComplete ? 'Profile Complete' : 'Profile Incomplete'}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="mb-0">Profile Information</h4>
                  {editMode && (
                    <div>
                      <button 
                        onClick={() => {
                          setEditMode(false);
                          setFormData({
                            name: adminData.name,
                            photoUrl: adminData.photoUrl
                          });
                        }}
                        className="btn btn-outline-secondary btn-sm me-2"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleSubmit}
                        className="btn btn-warning btn-sm"
                      >
                        Save Changes
                      </button>
                    </div>
                  )}
                </div>

                {editMode ? (
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="photoUrl" className="form-label">Profile Photo URL</label>
                      <input
                        type="text"
                        className="form-control"
                        id="photoUrl"
                        name="photoUrl"
                        value={formData.photoUrl}
                        onChange={handleInputChange}
                      />
                    </div>
                  </form>
                ) : (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="mb-4">
                        <h6 className="text-warning">Full Name</h6>
                        <p>{adminData.name}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <h6 className="text-warning">Email</h6>
                        <p>{adminData.email}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <h6 className="text-warning">Role</h6>
                        <p>{adminData.role.replace('_', ' ')}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="mb-4">
                        <h6 className="text-warning">Account Created</h6>
                        <p>{new Date(adminData.createdAt).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}