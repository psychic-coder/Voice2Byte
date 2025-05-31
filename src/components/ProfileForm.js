export default function ProfileForm({ editMode, formData, handleInputChange, handleSubmit, handleCancel, adminData }) {
  if (!adminData) return null;

  return (
    <div className="card shadow-sm border-0 rounded-3">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4 className="mb-0">Profile Information</h4>
          {editMode && (
            <div>
              <button onClick={handleCancel} className="btn btn-outline-secondary btn-sm me-2">Cancel</button>
              <button onClick={handleSubmit} className="btn btn-warning btn-sm">Save Changes</button>
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
                <p>{adminData.role?.replace('_', ' ')}</p>
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
  );
}
