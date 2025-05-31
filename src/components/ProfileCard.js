import Image from 'next/image';

export default function ProfileCard({ adminData, editMode, setEditMode, handleImageChange }) {
  if (!adminData) return null;

  return (
    <div className="card shadow-sm border-0 rounded-3 mb-4">
      <div className="card-body text-center">
        <div className="position-relative d-inline-block">
          <img 
            src={adminData.photoUrl || 'https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f'} 
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
                onChange={handleImageChange}
              />
            </div>
          )}
        </div>
        <h3 className="mt-3 mb-0">{adminData.name}</h3>
        <p className="text-muted mb-2">{adminData.role?.replace('_', ' ')}</p>

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
  );
}
