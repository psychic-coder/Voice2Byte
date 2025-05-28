
import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { config } from '@/data/axiosData';
import { showErrorToast, showSuccessToast } from '@/src/components/Toast';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api';

export default function AddFoodItem() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    tags: [],
    photoUrl: ''
  });
  const [newTag, setNewTag] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
     
      const dataToSend = {
        ...formData,
        price: Number(formData.price)
      };

      const response = await axios.post(`${BASE_URL}/hotelAdmin/addFoodItem`, dataToSend,config);
      
      if (response.status === 200 || response.status === 201) {
        router.push('/adminProfile/foodItem');
        showSuccessToast("Item created successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food item. Please try again.');
      console.error('Error adding food item:', err);
      showErrorToast("Item creation failed ")
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light">
      <Head>
        <title>Add New Food Item</title>
        <meta name="description" content="Add a new food item to the menu" />
      </Head>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0">
              <div className="card-header bg-warning text-white">
                <h2 className="h4 mb-0">Add New Food Item</h2>
              </div>
              <div className="card-body">
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">Item Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="price" className="form-label">Price (₹)</label>
                    <input
                      type="number"
                      className="form-control"
                      id="price"
                      name="price"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
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
                      onChange={handleChange}
                      required
                    />
                    <div className="form-text">Enter a valid image URL</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Tags</label>
                    <div className="input-group mb-2">
                      <input
                        type="text"
                        className="form-control"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="Add a tag (e.g., vegetarian)"
                      />
                      <button
                        className="btn btn-outline-warning"
                        type="button"
                        onClick={handleTagAdd}
                      >
                        Add Tag
                      </button>
                    </div>
                    
                    {formData.tags.length > 0 && (
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
                    )}
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button
                      type="submit"
                      className="btn btn-warning text-white"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Adding...
                        </>
                      ) : 'Add Food Item'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}