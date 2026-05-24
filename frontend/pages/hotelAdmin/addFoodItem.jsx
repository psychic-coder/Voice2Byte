import { useState } from 'react';
import axios from 'axios';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { config } from '@/data/axiosData';
import { showErrorToast, showSuccessToast } from '@/src/components/Toast';
import Layout from '@/src/layouts/Layout';

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

      const response = await axios.post(`${BASE_URL}/hotelAdmin/addFoodItem`, dataToSend, config);
      
      if (response.status === 200 || response.status === 201) {
        router.push('/adminProfile/foodItem');
        showSuccessToast("Item created successfully");
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add food item. Please try again.');
      console.error('Error adding food item:', err);
      showErrorToast("Item creation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <Head>
        <title>Add New Food Item</title>
        <meta name="description" content="Add a new food item to the menu" />
      </Head>
      
      <style jsx>{`
        .gradient-bg {
          background: linear-gradient(135deg, #ffeaa7 0%, #fdcb6e 25%, #e17055 50%, #fdcb6e 75%, #ffeaa7 100%);
          min-height: 100vh;
          position: relative;
          overflow: hidden;
        }
        
        .gradient-bg::before {
          content: '';
          position: absolute;
          top: -50%;
          left: -50%;
          width: 200%;
          height: 200%;
          background: radial-gradient(circle, rgba(255,193,7,0.08) 0%, transparent 70%);
          animation: rotate 20s linear infinite;
        }
        
        @keyframes rotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .glass-card {
          background: #ffffff;
          border: 2px solid #ffc107;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 0 30px rgba(255, 193, 7, 0.2);
          border-radius: 20px;
          overflow: hidden;
          animation: fadeInUp 0.8s ease-out;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .modern-header {
          background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
          position: relative;
          overflow: hidden;
        }
        
        .modern-header::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 200%;
          background: linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent);
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0%, 100% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
        }
        
        .modern-input {
          border: 2px solid #ffc107;
          border-radius: 12px;
          transition: all 0.3s ease;
          background: #ffffff;
          color: #212529;
          font-weight: 500;
          font-size: 16px;
        }
        
        .modern-input:focus {
          border-color: #ff8f00;
          box-shadow: 0 0 0 0.2rem rgba(255, 193, 7, 0.25);
          background: #ffffff;
          transform: translateY(-2px);
          color: #212529;
        }
        
        .modern-input::placeholder {
          color: #6c757d;
          opacity: 1;
        }
        
        .modern-btn {
          background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
          border: none;
          border-radius: 12px;
          font-weight: 600;
          letter-spacing: 0.5px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .modern-btn::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transition: left 0.5s;
        }
        
        .modern-btn:hover::before {
          left: 100%;
        }
        
        .modern-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(255, 193, 7, 0.3);
        }
        
        .tag-badge {
          background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
          border-radius: 25px;
          font-weight: 500;
          transition: all 0.3s ease;
          cursor: pointer;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        .tag-badge:hover {
          transform: scale(1.05);
          box-shadow: 0 5px 15px rgba(255, 193, 7, 0.3);
        }
        
        .form-field {
          animation: slideInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .form-field:nth-child(1) { animation-delay: 0.1s; }
        .form-field:nth-child(2) { animation-delay: 0.2s; }
        .form-field:nth-child(3) { animation-delay: 0.3s; }
        .form-field:nth-child(4) { animation-delay: 0.4s; }
        .form-field:nth-child(5) { animation-delay: 0.5s; }
        .form-field:nth-child(6) { animation-delay: 0.6s; }
        
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .floating-elements {
          position: absolute;
          width: 100%;
          height: 100%;
          pointer-events: none;
        }
        
        .floating-circle {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 193, 7, 0.15);
          animation: float 6s ease-in-out infinite;
          border: 1px solid rgba(255, 193, 7, 0.2);
        }
        
        .floating-circle:nth-child(1) {
          width: 80px;
          height: 80px;
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }
        
        .floating-circle:nth-child(2) {
          width: 120px;
          height: 120px;
          top: 60%;
          right: 15%;
          animation-delay: -2s;
        }
        
        .floating-circle:nth-child(3) {
          width: 60px;
          height: 60px;
          bottom: 20%;
          left: 20%;
          animation-delay: -4s;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        .section-divider {
          height: 2px;
          background: linear-gradient(90deg, transparent, #ffc107, transparent);
          margin: 2rem 0;
          border-radius: 2px;
        }
        
        .pulse-on-hover:hover {
          animation: pulse 0.5s ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
      `}</style>

      <div className="gradient-bg" style={{paddingTop:"30px"}}>
        <div className="floating-elements">
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
          <div className="floating-circle"></div>
        </div>
        
        <div className="container py-5 position-relative" style={{ zIndex: 10 }}>
          <div className="row justify-content-center">
            <div className="col-lg-8">
              <div className="glass-card">
                <div className="modern-header p-4">
                  <h2 className="h3 mb-0 text-white fw-bold text-center">
                    ✨ Add New Food Item
                  </h2>
                  <p className="text-white-50 text-center mb-0 mt-2">
                    Create something delicious for your menu
                  </p>
                </div>
                
                <div className="p-4">
                  {error && (
                    <div className="alert alert-danger border-0 rounded-3 mb-4" role="alert">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit}>
                    <div className="form-field mb-4">
                      <label htmlFor="name" className="form-label fw-bold mb-2" style={{ color: '#212529', fontSize: '16px' }}>
                        <i className="bi bi-bookmark-fill me-2 text-warning"></i>
                        Item Name
                      </label>
                      <input
                        type="text"
                        className="form-control modern-input py-3 pulse-on-hover"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter the delicious name..."
                        required
                      />
                    </div>

                    <div className="form-field mb-4">
                      <label htmlFor="description" className="form-label fw-bold mb-2" style={{ color: '#212529', fontSize: '16px' }}>
                        <i className="bi bi-card-text me-2 text-warning"></i>
                        Description
                      </label>
                      <textarea
                        className="form-control modern-input pulse-on-hover"
                        id="description"
                        name="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe what makes this dish special..."
                        required
                        style={{ resize: 'none' }}
                      ></textarea>
                    </div>

                    <div className="row">
                      <div className="form-field col-md-6 mb-4">
                        <label htmlFor="price" className="form-label fw-bold mb-2" style={{ color: '#212529', fontSize: '16px' }}>
                          <i className="bi bi-currency-rupee me-2 text-warning"></i>
                          Price
                        </label>
                        <div className="input-group">
                          <span className="input-group-text bg-warning text-white border-0">₹</span>
                          <input
                            type="number"
                            className="form-control modern-input border-start-0 pulse-on-hover"
                            id="price"
                            name="price"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-field col-md-6 mb-4">
                        <label htmlFor="photoUrl" className="form-label fw-bold mb-2" style={{ color: '#212529', fontSize: '16px' }}>
                          <i className="bi bi-image me-2 text-warning"></i>
                          Photo URL
                        </label>
                        <input
                          type="url"
                          className="form-control modern-input py-3 pulse-on-hover"
                          id="photoUrl"
                          name="photoUrl"
                          value={formData.photoUrl}
                          onChange={handleChange}
                          placeholder="https://example.com/image.jpg"
                          required
                        />
                      </div>
                    </div>

                    <div className="section-divider"></div>

                    <div className="form-field mb-4">
                      <label className="form-label fw-bold mb-2" style={{ color: '#212529', fontSize: '16px' }}>
                        <i className="bi bi-tags me-2 text-warning"></i>
                        Tags
                      </label>
                      <div className="input-group mb-3">
                        <input
                          type="text"
                          className="form-control modern-input border-end-0 pulse-on-hover"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add a tag (e.g., vegetarian, spicy)"
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTagAdd())}
                        />
                        <button
                          className="btn modern-btn text-white px-4"
                          type="button"
                          onClick={handleTagAdd}
                        >
                          <i className="bi bi-plus-lg me-1"></i>
                          Add
                        </button>
                      </div>
                      
                      {formData.tags.length > 0 && (
                        <div className="d-flex flex-wrap gap-2">
                          {formData.tags.map(tag => (
                            <span 
                              key={tag} 
                              className="badge tag-badge text-white px-3 py-2 d-flex align-items-center"
                            >
                              <i className="bi bi-tag-fill me-1"></i>
                              {tag}
                              <button
                                type="button"
                                className="btn-close btn-close-white ms-2"
                                style={{ fontSize: '0.7rem' }}
                                onClick={() => handleTagRemove(tag)}
                              ></button>
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="form-field d-grid gap-2 mt-5">
                      <button
                        type="submit"
                        className="btn modern-btn text-white py-3 fs-5 fw-bold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? (
                          <>
                            <div className="spinner-border spinner-border-sm me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            Creating Magic...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-plus-circle me-2"></i>
                            Add Food Item
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}