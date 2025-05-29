
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Head from 'next/head';
import Link from 'next/link';
import { config } from '@/data/axiosData';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export default function foodUpdate() {
  const router = useRouter();
  const { itemId } = router.query;
  const [foodItem, setFoodItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: [],
    photoUrl: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  
  useEffect(() => {
    if (!itemId) return;

    const fetchFoodItem = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`${BASE_URL}/hotelAdmin/getAllFoodItems/${itemId}`,config);
        console.log(response)
        if (response.data.success) {
          setFoodItem(response.data.foodItem);
          setFormData({
            name: response.data.foodItem.name,
            description: response.data.foodItem.description,
            price: response.data.foodItem.price,
            tags: response.data.foodItem.tags,
            photoUrl: response.data.foodItem.photoUrl
          });
        } else {
          setError(response.data.message || 'Failed to fetch food item');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch food item');
        console.error('Error fetching food item:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFoodItem();
  }, [itemId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagAdd = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag]
      }));
      setNewTag('');
    }
  };

  const handleTagRemove = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTagAdd();
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    try {
      const response = await axios.put(
        `${BASE_URL}/hotelAdmin/updateFoodItem/${itemId}`,
        {
          name: formData.name,
          description: formData.description,
          price: Number(formData.price),
          tags: formData.tags,
          photoUrl: formData.photoUrl
        }
      );

      if (response.data.success) {
        setSuccessMessage('Food item updated successfully!');
        setFoodItem(prev => ({
          ...prev,
          ...formData,
          price: Number(formData.price)
        }));
        setIsEditing(false);
        // Refresh data
        const refreshResponse = await axios.get(`${BASE_URL}/hotelAdmin/getAllFoodItems/${itemId}`,config);
        setFoodItem(refreshResponse.data.foodItem);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update food item');
      console.error('Error updating food item:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-light">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="alert alert-danger text-center">
          <h4>{error}</h4>
          <Link href="/hotelAdmin/dashboard" className="btn btn-warning mt-3">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!foodItem) {
    return (
      <div className="min-vh-100 bg-light d-flex justify-content-center align-items-center">
        <div className="alert alert-warning text-center">
          <h4>Food item not found</h4>
          <Link href="/hotelAdmin/dashboard" className="btn btn-warning mt-3">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <Head>
        <title>{foodItem.name} - Food Item Details</title>
        <meta name="description" content={`Details for ${foodItem.name}`} />
      </Head>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 mb-4">
              <div className="card-header bg-warning text-white d-flex justify-content-between align-items-center">
                <h2 className="h4 mb-0">
                  {isEditing ? 'Edit Food Item' : foodItem.name}
                </h2>
                <button
                  className={`btn btn-sm ${isEditing ? 'btn-outline-light' : 'btn-light'}`}
                  onClick={() => setIsEditing(!isEditing)}
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </button>
              </div>

              <div className="card-body">
                {successMessage && (
                  <div className="alert alert-success" role="alert">
                    {successMessage}
                  </div>
                )}

                {isEditing ? (
                  <form onSubmit={handleUpdate}>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
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
                      <label htmlFor="description" className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        id="description"
                        name="description"
                        rows="3"
                        value={formData.description}
                        onChange={handleInputChange}
                        required
                      ></textarea>
                    </div>

                    <div className="mb-3">
                      <label htmlFor="price" className="form-label">Price</label>
                      <input
                        type="number"
                        className="form-control"
                        id="price"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="photoUrl" className="form-label">Photo URL</label>
                      <input
                        type="url"
                        className="form-control"
                        id="photoUrl"
                        name="photoUrl"
                        value={formData.photoUrl}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label className="form-label">Tags</label>
                      <div className="input-group mb-2">
                        <input
                          type="text"
                          className="form-control"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                          placeholder="Add a tag (e.g., vegetarian)"
                        />
                        <button
                          className="btn btn-outline-warning"
                          type="button"
                          onClick={handleTagAdd}
                        >
                          Add
                        </button>
                      </div>
                      
                      <div className="d-flex flex-wrap gap-2">
                        {formData.tags.map(tag => (
                          <span key={tag} className="badge bg-warning text-dark">
                            {tag}
                            <button
                              type="button"
                              className="ms-2 btn-close btn-close-white"
                              aria-label="Remove"
                              onClick={() => handleTagRemove(tag)}
                            ></button>
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="d-grid">
                      <button type="submit" className="btn btn-warning text-white">
                        Update Food Item
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="row mb-4">
                      <div className="col-md-6">
                        <img
                          src={"https://images.unsplash.com/photo-1736239092023-ba677fd6751c?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGluZGlhbiUyMGZvb2RpdGVtc3xlbnwwfHwwfHx8MA%3D%3D"}
                          alt={foodItem.name}
                          className="img-fluid rounded"
                          style={{ maxHeight: '300px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.src = '/images/food-placeholder.jpg';
                          }}
                        />
                      </div>
                      <div className="col-md-6">
                        <h3 className="text-warning">{foodItem.name}</h3>
                        <p className="lead">₹{foodItem.price.toFixed(2)}</p>
                        <p>{foodItem.description}</p>
                        
                        <div className="mb-3">
                          <h5>Tags:</h5>
                          <div className="d-flex flex-wrap gap-2">
                            {foodItem.tags.map(tag => (
                              <span key={tag} className="badge bg-warning text-dark">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mb-3">
                          <h5>Availability:</h5>
                          <span className={`badge ${foodItem.isAvailable ? 'bg-success' : 'bg-danger'}`}>
                            {foodItem.isAvailable ? 'Available' : 'Not Available'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="card mb-4">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Restaurant Information</h5>
                      </div>
                      <div className="card-body">
                        <div className="d-flex align-items-center">
                          {foodItem.restaurant.photoUrl && (
                            <img
                              src={"https://plus.unsplash.com/premium_photo-1661964071015-d97428970584?q=80&w=3420&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                              alt={foodItem.restaurant.name}
                              className="rounded me-3"
                              width="80"
                              height="80"
                              style={{ objectFit: 'cover' }}
                              onError={(e) => {
                                e.target.src = '/images/restaurant-placeholder.jpg';
                              }}
                            />
                          )}
                          <div>
                            <h5>{foodItem.restaurant.name}</h5>
                            <p className="mb-1">{foodItem.restaurant.address}</p>
                            <p className="mb-1 text-muted">{foodItem.restaurant.location}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="card">
                      <div className="card-header bg-light">
                        <h5 className="mb-0">Created By</h5>
                      </div>
                      <div className="card-body">
                        <p className="mb-1"><strong>Name:</strong> {foodItem.createdBy.name}</p>
                        <p className="mb-0"><strong>Email:</strong> {foodItem.createdBy.email}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* <div className="text-center">
              <Link href="/hotelAdmin/dashboard" className="btn btn-outline-warning">
                Back 
              </Link>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}