import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "@/data/axiosData";
import { showErrorToast, showSuccessToast } from "@/src/components/Toast";
import 'animate.css';
import Layout from "@/src/layouts/Layout";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    address: "",
    latitude: "",
    longitude: "",
    photoUrl: "",
  });
  const [displayData, setDisplayData] = useState({
    name: "",
    email: "",
    password: "",
    restaurantName: "",
    address: "",
    latitude: "",
    longitude: "",
    photoUrl: "",
  });
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    fetchAdminProfile();
  }, []);

  const fetchAdminProfile = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/hotelAdmin/me`, config);
      if (res.data.success) {
        const { profile } = res.data;
        setAdmin(profile);
        const profileData = {
          name: profile.name || "",
          email: profile.email || "",
          restaurantName: profile.restaurant?.name || "",
          latitude: profile.restaurant?.latitude?.toString() || "",
          longitude: profile.restaurant?.longitude?.toString() || "",
          address: profile.restaurant?.address || "",
          photoUrl: profile.restaurant?.photoUrl || "",
        };
        setDisplayData(profileData);
        setFormData(profileData);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setUpdateLoading(true);
      await axios.put(`${BASE_URL}/hotelAdmin/me`, formData, config);

      await fetchAdminProfile();
      setEditing(false);
      showSuccessToast("Profile updated successfully");
    } catch (err) {
      console.error("Error updating profile:", err);
      showErrorToast("Profile update failed");
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setFormData({ ...displayData });
  };

  const handleEdit = () => {
    setEditing(true);
    setFormData({ ...displayData });
  };

  if (loading && !admin) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-75">
        <div className="spinner-grow text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Layout>
    <div className="bg-light" style={{paddingTop:"100px"}}>
      {/* Header Section */}
      <div className="bg-dark bg-gradient py-5 position-relative overflow-hidden">
        <div className="container position-relative z-index-1">
          <div className="row align-items-center">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold text-white mb-3 animate__animated animate__fadeInDown">
                Admin Dashboard
              </h1>
              <p className="lead text-white-50 mb-0 animate__animated animate__fadeIn animate__delay-1s">
                Manage your restaurant profile and settings
              </p>
            </div>
            <div className="col-md-4 text-md-end mt-4 mt-md-0">
              <div className="badge bg-warning text-dark px-3 py-2 rounded-pill d-inline-flex align-items-center animate__animated animate__zoomIn animate__delay-1s">
                <i className="bi bi-shield-lock me-2"></i>
                Administrator Access
              </div>
            </div>
          </div>
        </div>
        <div className="position-absolute top-0 end-0 w-100 h-100 bg-pattern opacity-10"></div>
      </div>

      {/* Main Content */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Profile Card */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInLeft">
              <div className="card-header bg-warning py-4">
                <div className="d-flex align-items-center">
                  <div className="flex-shrink-0">
                    <div className="avatar avatar-xl position-relative">
                      <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        className="rounded-circle border border-3 border-white"
                        alt="Admin"
                        width="80"
                      />
                      <span className="position-absolute bottom-0 end-0 bg-success rounded-circle p-1 border border-2 border-white"></span>
                    </div>
                  </div>
                  <div className="flex-grow-1 ms-3 text-dark">
                    <h5 className="mb-1 fw-bold">{displayData.name}</h5>
                    <p className="mb-0 small">{displayData.email}</p>
                  </div>
                </div>
              </div>
              <div className="card-body">
                <div className="mb-4">
                  <h6 className="text-uppercase fw-bold text-muted mb-3">
                    Restaurant Overview
                  </h6>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-shop text-warning me-2"></i>
                    <span>{displayData.restaurantName || "Not specified"}</span>
                  </div>
                  <div className="d-flex align-items-center mb-2">
                    <i className="bi bi-geo-alt text-warning me-2"></i>
                    <span>{displayData.address || "Address not provided"}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <i className="bi bi-image text-warning me-2"></i>
                    <span>
                      {displayData.photoUrl ? (
                        <a href={displayData.photoUrl} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
                          View Photo
                        </a>
                      ) : (
                        "No photo"
                      )}
                    </span>
                  </div>
                </div>

                <div className="border-top pt-3">
                  <h6 className="text-uppercase fw-bold text-muted mb-3">
                    Quick Stats
                  </h6>
                  {admin?.restaurant && (
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="bg-light rounded-3 p-3 text-center">
                          <div className="text-warning mb-1">
                            <i className="bi bi-star-fill fs-5"></i>
                          </div>
                          <h5 className="mb-0">{admin.restaurant.rating || "0"}</h5>
                          <small className="text-muted">Rating</small>
                        </div>
                      </div>
                      <div className="col-6">
                        <div className="bg-light rounded-3 p-3 text-center">
                          <div className="text-warning mb-1">
                            <i className="bi bi-egg-fried fs-5"></i>
                          </div>
                          <h5 className="mb-0">{admin.restaurant.totalFoodItems || 0}</h5>
                          <small className="text-muted">Menu Items</small>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Edit Form */}
          <div className="col-lg-8">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden animate__animated animate__fadeInRight">
              <div className="card-header bg-white py-3 border-bottom">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-pencil-square text-warning me-2"></i>
                    {editing ? "Edit Profile" : "Profile Information"}
                  </h5>
                  {!editing ? (
                    <button
                      onClick={handleEdit}
                      className="btn btn-sm btn-warning rounded-pill px-3"
                    >
                      <i className="bi bi-pencil me-1"></i> Edit
                    </button>
                  ) : (
                    <div className="d-flex gap-2">
                      <button
                        onClick={handleCancel}
                        className="btn btn-sm btn-outline-secondary rounded-pill px-3"
                        disabled={updateLoading}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="btn btn-sm btn-warning rounded-pill px-3"
                        disabled={updateLoading}
                      >
                        {updateLoading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-1"></span>
                            Saving...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-1"></i> Save
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <div className="card-body">
                <form onSubmit={handleSubmit}>
                  <div className="row g-3">
                    <div className="col-12">
                      <h6 className="text-uppercase text-muted fw-bold mb-3 border-bottom pb-2">
                        Personal Information
                      </h6>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-person text-warning"></i>
                        </span>
                        <input
                          type="text"
                          name="name"
                          value={editing ? formData.name : displayData.name}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder="Your full name"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-envelope text-warning"></i>
                        </span>
                        <input
                          type="email"
                          name="email"
                          value={editing ? formData.email : displayData.email}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder="Your email"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Password</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-lock text-warning"></i>
                        </span>
                        <input
                          type="password"
                          name="password"
                          value={editing ? formData.password : "••••••••"}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder={editing ? "New password (leave blank to keep current)" : "Password"}
                        />
                      </div>
                      {editing && (
                        <small className="text-muted">
                          Leave blank to keep current password
                        </small>
                      )}
                    </div>

                    <div className="col-12 mt-4">
                      <h6 className="text-uppercase text-muted fw-bold mb-3 border-bottom pb-2">
                        Restaurant Information
                      </h6>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Restaurant Name</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-shop text-warning"></i>
                        </span>
                        <input
                          type="text"
                          name="restaurantName"
                          value={editing ? formData.restaurantName : displayData.restaurantName}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder="Restaurant name"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Address</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-geo-alt text-warning"></i>
                        </span>
                        <textarea
                          name="address"
                          value={editing ? formData.address : displayData.address}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          rows="2"
                          placeholder="Full restaurant address"
                        ></textarea>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Latitude</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-geo text-warning"></i>
                        </span>
                        <input
                          type="text"
                          name="latitude"
                          value={editing ? formData.latitude : displayData.latitude}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder="e.g. 40.7128"
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Longitude</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-geo text-warning"></i>
                        </span>
                        <input
                          type="text"
                          name="longitude"
                          value={editing ? formData.longitude : displayData.longitude}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder="e.g. -74.0060"
                        />
                      </div>
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold">Photo URL</label>
                      <div className="input-group">
                        <span className="input-group-text bg-light">
                          <i className="bi bi-image text-warning"></i>
                        </span>
                        <input
                          type="url"
                          name="photoUrl"
                          value={editing ? formData.photoUrl : displayData.photoUrl}
                          onChange={handleChange}
                          disabled={!editing}
                          className="form-control"
                          placeholder="https://example.com/photo.jpg"
                        />
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Restaurant Details */}
        {admin?.restaurant && (
          <div className="row mt-4 animate__animated animate__fadeInUp">
            <div className="col-12">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="card-header bg-white py-3">
                  <h5 className="mb-0 fw-bold">
                    <i className="bi bi-info-circle text-warning me-2"></i>
                    Restaurant Details
                  </h5>
                </div>
                <div className="card-body">
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div className="mb-3">
                        <h6 className="fw-bold text-muted">Description</h6>
                        <p className="mb-0">
                          {admin.restaurant.desc || "No description available"}
                        </p>
                      </div>

                      <div className="mb-3">
                        <h6 className="fw-bold text-muted">Categories</h6>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {admin.restaurant.category?.map((cat, index) => (
                            <span
                              key={index}
                              className="badge bg-warning bg-opacity-10 text-warning rounded-pill px-3 py-1"
                            >
                              {cat}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="mb-3">
                        <h6 className="fw-bold text-muted">Tags</h6>
                        <div className="d-flex flex-wrap gap-2 mt-2">
                          {admin.restaurant.hotelTags?.map((tag, index) => (
                            <span
                              key={index}
                              className="badge bg-light text-dark border rounded-pill px-3 py-1"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mb-3">
                        <h6 className="fw-bold text-muted">Contact</h6>
                        <div className="d-flex align-items-center gap-2 mt-2">
                          <i className="bi bi-telephone text-warning"></i>
                          <span>
                            {admin.restaurant.phone || "Not provided"}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .bg-pattern {
          background-image: radial-gradient(rgba(255, 193, 7, 0.2) 1px, transparent 1px);
          background-size: 20px 20px;
        }
        .avatar {
          transition: all 0.3s ease;
        }
        .avatar:hover {
          transform: scale(1.05);
        }
        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }
        .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 1rem 3rem rgba(0, 0, 0, 0.175) !important;
        }
        .input-group-text {
          min-width: 45px;
          justify-content: center;
        }
      `}</style>
    </div>
    </Layout>
  );
};

export default AdminProfile;