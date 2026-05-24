import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { config } from '@/data/axiosData';
import ProfileCard from '@//src/components/ProfileCard';
import AccountDetails from '@/src/components/AccountDetails';
import ProfileForm from '@/src/components/ProfileForm';
import AdminHeader from './AdminHeader';
import { useDispatch } from 'react-redux';
import { signOutSuccess } from '@/redux/reducers/userslice';

export default function AdminProfile() {
  const [adminData, setAdminData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', photoUrl: '' });
  const router = useRouter();

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get('http://localhost:4000/api/companyAdmin/me', config);
        setAdminData(res.data.admin);
        setFormData({ name: res.data.admin.name, photoUrl: res.data.admin.photoUrl });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    fetchAdmin();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, photoUrl: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put('http://localhost:4000/api/companyAdmin/me', formData, config);
      setAdminData(res.data.admin);
      setEditMode(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Update failed');
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({ name: adminData.name, photoUrl: adminData.photoUrl });
  };
  const dispatch=useDispatch()
  const handleSignOut = () => {
    dispatch(signOutSuccess());
    router.push('/signin');
  };

  if (loading) return <div className="text-center mt-5"><div className="spinner-border text-warning"></div></div>;
  if (error) return <div className="alert alert-danger mt-3">{error}</div>;
  if (!adminData) return <div className="alert alert-warning mt-3">No profile found</div>;

  return (
    <>
      <AdminHeader />
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <ProfileCard adminData={adminData} editMode={editMode} setEditMode={setEditMode} handleImageChange={handleImageChange} />
            <button onClick={handleSignOut} className="btn btn-outline-danger w-100 mt-3">Sign Out</button>
            <AccountDetails adminData={adminData} />
          </div>
          <div className="col-lg-8">
            <ProfileForm 
              editMode={editMode} 
              formData={formData} 
              handleInputChange={handleInputChange} 
              handleSubmit={handleSubmit} 
              handleCancel={handleCancel} 
              adminData={adminData} 
            />
          </div>
        </div>
      </div>
    </>
  );
}