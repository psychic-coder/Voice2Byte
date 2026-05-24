// components/ProfileInfoSection.jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { config } from '@/data/axiosData';
import { UploadImage } from './UploadImage';
import { showErrorToast, showSuccessToast } from './Toast';


const ProfileInfoSection = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [tempPhoto, setTempPhoto] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    photoUrl: ''
  });

  useEffect(() => {
    if (currentUser?.user) {
      setFormData({
        name: currentUser.user.name || '',
        email: currentUser.user.email || '',
        photoUrl: currentUser.user.photoUrl || ''
      });
    }
  }, [currentUser]);

  if (!currentUser?.user) return <div>Loading profile data...</div>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match('image.*')) {
        setError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { 
        setError('Image size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      setTempPhoto(URL.createObjectURL(file));
      setError(null);
      setUploadProgress(0);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return formData.photoUrl;

    try {
      setIsUploading(true);
      setError(null);
      
      const photoUrl = await UploadImage(selectedFile, {
        uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
        cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
        onProgress: (progress) => setUploadProgress(progress)
      });
      
      return photoUrl;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setError(null);
      
      const photoUrl = await handleImageUpload();
      
   
      const updatedData = {
        ...formData,
        photoUrl: photoUrl || formData.photoUrl
      };
      
      const res = await axios.put(
        'http://localhost:4000/api/customer/me',
        updatedData,
        config
      );
      setFormData({
        name: res.data.updated.name,
        email: res.data.updated.email,
        photoUrl: res.data.updated.photoUrl
      });
      
      setIsEditing(false);
      setTempPhoto(null);
      setSelectedFile(null);
      setUploadProgress(0);
      showSuccessToast("Profile updated successfully")
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update profile');
      showErrorToast("Error while uploading the image")
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="col-lg-8">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 pb-0">
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h4 className="mb-1 fw-bold text-warning">Profile Information</h4>
              <p className="text-muted mb-0">Manage your personal details and preferences</p>
            </div>
            <div className="d-flex gap-2">
              {!isEditing ? (
                <button 
                  className="btn btn-warning rounded-pill px-4"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              ) : (
                <>
                  <button 
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => {
                      setIsEditing(false);
                      setTempPhoto(null);
                      setSelectedFile(null);
                      setError(null);
                      setUploadProgress(0);
                    }}
                    disabled={isLoading || isUploading}
                  >
                    Cancel
                  </button>
                  <button 
                    className="btn btn-warning rounded-pill px-4"
                    type="submit"
                    form="profileForm"
                    disabled={isLoading || isUploading}
                  >
                    {(isLoading || isUploading) ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        {isUploading ? `Uploading... ${uploadProgress}%` : 'Saving...'}
                      </>
                    ) : 'Save Changes'}
                  </button>
                </>
              )}
              <div className="bg-warning bg-opacity-10 rounded-circle p-3">
                <i className="bi bi-person-lines-fill text-warning fs-4"></i>
              </div>
            </div>
          </div>
        </div>
        
        <div className="card-body pt-4">
          {error && (
            <div className="alert alert-danger mb-4">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {error}
            </div>
          )}
          
          {isEditing ? (
            <form id="profileForm" onSubmit={handleSubmit}>
              <div className="row g-4">
              
                <div className="col-12">
                  <label className="form-label fw-semibold text-dark">Profile Photo</label>
                  <div className="d-flex align-items-center gap-3">
                    <div className="position-relative">
                      <img 
                        src={tempPhoto || formData.photoUrl || "/default-avatar.png"} 
                        alt="Preview" 
                        className="rounded-circle border"
                        width="80"
                        height="80"
                        style={{ objectFit: 'cover' }}
                      />
                      {(isUploading || isLoading) && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center bg-dark bg-opacity-50 rounded-circle">
                          <div className="spinner-border text-warning" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex-grow-1">
                      <input 
                        type="file" 
                        className="form-control rounded-pill border-0 shadow-sm" 
                        onChange={handlePhotoChange}
                        accept="image/*"
                        disabled={isLoading || isUploading}
                      />
                      <small className="text-muted">JPEG, PNG (Max 5MB)</small>
                      {isUploading && (
                        <div className="progress mt-2" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar bg-warning" 
                            role="progressbar" 
                            style={{ width: `${uploadProgress}%` }}
                            aria-valuenow={uploadProgress}
                            aria-valuemin="0"
                            aria-valuemax="100"
                          ></div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="form-label fw-semibold text-dark">
                    <i className="bi bi-person me-2 text-warning"></i>
                    Full Name
                  </label>
                  <input
                        type="text"
                        className="form-control rounded-pill border-0 shadow-sm bg-light px-4 py-3"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isUploading}
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-envelope me-2 text-warning"></i>
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control rounded-pill border-0 shadow-sm bg-light px-4 py-3"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={isLoading || isUploading}
                        placeholder="Enter your email"
                      />
                    </div>

                    <div className="col-12">
                      <label className="form-label fw-semibold text-dark">
                        <i className="bi bi-image me-2 text-warning"></i>
                        Profile Photo URL
                      </label>
                      <input
                        type="url"
                        className="form-control rounded-pill border-0 shadow-sm bg-light px-4 py-3"
                        name="photoUrl"
                        value={formData.photoUrl}
                        onChange={handleInputChange}
                        disabled={isLoading || isUploading}
                        placeholder="Or enter photo URL directly"
                      />
                    </div>
                  </div>
                </form>
          ) : (
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-person text-warning me-2"></i>
                      <h6 className="text-muted mb-0 fw-semibold">Full Name</h6>
                    </div>
                    <p className="mb-0 fs-5 fw-semibold text-dark">{currentUser.user.name}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-envelope text-warning me-2"></i>
                      <h6 className="text-muted mb-0 fw-semibold">Email</h6>
                    </div>
                    <p className="mb-0 fs-5 fw-semibold text-dark">{currentUser.user.email}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-calendar-check text-warning me-2"></i>
                      <h6 className="text-muted mb-0 fw-semibold">Member Since</h6>
                    </div>
                    <p className="mb-0 fs-5 fw-semibold text-dark">
                      {new Date(currentUser.user.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-4 bg-light rounded-4">
                    <div className="d-flex align-items-center mb-2">
                      <i className="bi bi-person-badge text-warning me-2"></i>
                      <h6 className="text-muted mb-0 fw-semibold">Role</h6>
                    </div>
                    <span className="badge bg-warning text-dark fs-6 px-3 py-2 rounded-pill fw-semibold">
                      {currentUser.user.role}
                    </span>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default ProfileInfoSection;