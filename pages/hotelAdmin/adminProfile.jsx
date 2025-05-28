import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "@/data/axiosData";
import { showErrorToast, showSuccessToast } from "@/src/components/Toast";

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

      showErrorToast("Profile update failed ");
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
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "50vh" }}
      >
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#fffbf0", minHeight: "100vh" }}
      >
        <div className="container">
          {/* Header */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <h1 className="display-5 fw-bold text-warning mb-1">
                    Admin Profile
                  </h1>
                  <p className="text-muted mb-0">
                    Manage your restaurant profile and information
                  </p>
                </div>
                <div className="d-flex align-items-center">
                  <div className="badge bg-warning text-dark px-3 py-2 rounded-pill">
                    <i className="bi bi-person-circle me-2"></i>
                    Administrator
                  </div>
                </div>
              </div>
            </div>
          </div>

        
          <div className="row justify-content-center">
            <div className="col-12 col-lg-8">
              <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
               
                <div className="position-relative">
                  <img
                    src={
                      "https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=3420&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    }
                    alt="Restaurant"
                    className="card-img-top"
                    style={{ height: "300px", objectFit: "cover" }}
                  />
                  <div className="position-absolute top-0 start-0 w-100 h-100 bg-dark bg-opacity-25 d-flex align-items-end">
                    <div className="p-4 text-white">
                      <h3 className="fw-bold mb-1">
                        {editing
                          ? formData.restaurantName
                          : displayData.restaurantName || "Restaurant Name"}
                      </h3>
                      <p className="mb-0 opacity-75">
                        <i className="bi bi-geo-alt me-1"></i>
                        {editing
                          ? `${formData.address || "Address not specified"}`
                          : `${displayData.address || "Address not specified"}`}
                      </p>
                      <p className="mb-0 opacity-75">
                        <i className="bi bi-compass me-1"></i>
                        Lat:{" "}
                        {editing
                          ? formData.latitude
                          : displayData.latitude || "N/A"}
                        , Lng:{" "}
                        {editing
                          ? formData.longitude
                          : displayData.longitude || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

               
                <div className="card-body p-4 p-md-5">
                  <form onSubmit={handleSubmit}>
                    <div className="row g-4">
                      
                      <div className="col-12">
                        <h5 className="fw-bold text-warning border-bottom border-warning pb-2 mb-4">
                          <i className="bi bi-person me-2"></i>
                          Personal Information
                        </h5>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-person-fill me-2 text-warning"></i>
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editing ? formData.name : displayData.name}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter your full name"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-envelope-fill me-2 text-warning"></i>
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editing ? formData.email : displayData.email}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter your email address"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-lock-fill me-2 text-warning"></i>
                          Password
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={editing ? formData.password : "********"}
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder={
                            editing
                              ? "Enter new password (leave empty to keep current)"
                              : "Password"
                          }
                        />
                        {editing && (
                          <small className="text-muted">
                            Leave empty to keep current password
                          </small>
                        )}
                      </div>

                      {/* Restaurant Information */}
                      <div className="col-12 mt-5">
                        <h5 className="fw-bold text-warning border-bottom border-warning pb-2 mb-4">
                          <i className="bi bi-shop me-2"></i>
                          Restaurant Information
                        </h5>
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-shop-window me-2 text-warning"></i>
                          Restaurant Name
                        </label>
                        <input
                          type="text"
                          name="restaurantName"
                          value={
                            editing
                              ? formData.restaurantName
                              : displayData.restaurantName
                          }
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter restaurant name"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-geo-fill me-2 text-warning"></i>
                          Restaurant Address
                        </label>
                        <textarea
                          name="address"
                          value={
                            editing ? formData.address : displayData.address
                          }
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter complete restaurant address"
                          rows="2"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-geo-alt-fill me-2 text-warning"></i>
                          Latitude
                        </label>
                        <input
                          type="text"
                          name="latitude"
                          value={
                            editing ? formData.latitude : displayData.latitude
                          }
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter latitude coordinates"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-compass me-2 text-warning"></i>
                          Longitude
                        </label>
                        <input
                          type="text"
                          name="longitude"
                          value={
                            editing ? formData.longitude : displayData.longitude
                          }
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter longitude coordinates"
                        />
                      </div>

                      <div className="col-12">
                        <label className="form-label fw-semibold text-dark">
                          <i className="bi bi-image-fill me-2 text-warning"></i>
                          Restaurant Photo URL
                        </label>
                        <input
                          type="url"
                          name="photoUrl"
                          value={
                            editing ? formData.photoUrl : displayData.photoUrl
                          }
                          onChange={handleChange}
                          disabled={!editing}
                          className={`form-control ${
                            editing ? "border-warning" : ""
                          }`}
                          style={{
                            backgroundColor: editing ? "#fff" : "#f8f9fa",
                          }}
                          placeholder="Enter photo URL"
                        />
                      </div>

                      {/* Action Buttons */}
                      <div className="col-12 mt-5">
                        <div className="d-flex gap-3 justify-content-end">
                          {editing ? (
                            <>
                              <button
                                type="button"
                                onClick={handleCancel}
                                className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                                disabled={updateLoading}
                              >
                                <i className="bi bi-x-circle me-2"></i>
                                Cancel
                              </button>
                              <button
                                type="submit"
                                className="btn btn-warning px-4 py-2 rounded-pill fw-semibold"
                                disabled={updateLoading}
                              >
                                {updateLoading ? (
                                  <>
                                    <span
                                      className="spinner-border spinner-border-sm me-2"
                                      role="status"
                                    ></span>
                                    Saving...
                                  </>
                                ) : (
                                  <>
                                    <i className="bi bi-check-circle me-2"></i>
                                    Save Changes
                                  </>
                                )}
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={handleEdit}
                              className="btn btn-warning px-4 py-2 rounded-pill fw-semibold"
                            >
                              <i className="bi bi-pencil-square me-2"></i>
                              Edit Profile
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>

         
          {admin?.restaurant && (
            <div className="row mt-5">
              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                      <i className="bi bi-star-fill text-warning fs-4"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Restaurant Rating</h5>
                    <h3 className="text-warning mb-0">
                      {admin.restaurant.rating || "0"}/5
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                      <i className="bi bi-basket-fill text-warning fs-4"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Total Food Items</h5>
                    <h3 className="text-warning mb-0">
                      {admin.restaurant.totalFoodItems || 0}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                      <i className="bi bi-receipt text-warning fs-4"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Recent Orders</h5>
                    <h3 className="text-warning mb-0">
                      {admin.restaurant.recentOrders?.length || 0}
                    </h3>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card border-0 shadow-sm rounded-3 h-100">
                  <div className="card-body text-center p-4">
                    <div className="bg-warning bg-opacity-10 rounded-circle p-3 d-inline-flex mb-3">
                      <i className="bi bi-telephone-fill text-warning fs-4"></i>
                    </div>
                    <h5 className="fw-bold mb-2">Phone</h5>
                    <p className="text-warning mb-0 small">
                      {admin.restaurant.phone || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Restaurant Details Section */}
          {admin?.restaurant && (
            <div className="row mt-4">
              <div className="col-12">
                <div className="card border-0 shadow-sm rounded-3">
                  <div className="card-body p-4">
                    <h5 className="fw-bold text-warning mb-4">
                      <i className="bi bi-info-circle me-2"></i>
                      Restaurant Details
                    </h5>
                    <div className="row g-4">
                      <div className="col-md-6">
                        <div className="mb-3">
                          <strong className="text-dark">Location:</strong>
                          <p className="mb-1 text-muted">
                            {admin.restaurant.location || "Not specified"}
                          </p>
                        </div>
                        <div className="mb-3">
                          <strong className="text-dark">Categories:</strong>
                          <div className="mt-1">
                            {admin.restaurant.category?.map((cat, index) => (
                              <span
                                key={index}
                                className="badge bg-warning text-dark me-1 mb-1"
                              >
                                {cat}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="mb-3">
                          <strong className="text-dark">Tags:</strong>
                          <div className="mt-1">
                            {admin.restaurant.hotelTags?.map((tag, index) => (
                              <span
                                key={index}
                                className="badge bg-outline-warning text-warning border border-warning me-1 mb-1"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-3">
                          <strong className="text-dark">Description:</strong>
                          <p className="mb-1 text-muted">
                            {admin.restaurant.desc ||
                              "No description available"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminProfile;
