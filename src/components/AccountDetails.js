export default function AccountDetails({ adminData }) {
  if (!adminData) return null;

  return (
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
  );
}