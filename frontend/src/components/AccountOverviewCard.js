
import { useSelector } from 'react-redux';

const AccountOverviewCard = () => {
  const { currentUser } = useSelector((state) => state.user);
  const customerData = currentUser?.user || {};
 

  return (
    <div className="col-lg-4">
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden mb-4">
        <div className="card-header bg-gradient bg-warning text-dark border-0">
          <div className="d-flex align-items-center">
            <i className="bi bi-graph-up fs-4 me-3"></i>
            <div>
              <h5 className="mb-0 fw-bold">Account Overview</h5>
              <small className="opacity-75">Your activity summary</small>
            </div>
          </div>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-6">
              <div className="text-center p-3 bg-success bg-opacity-10 rounded-4">
                <i className="bi bi-bag-check text-success fs-2 mb-2"></i>
                <h4 className="mb-1 fw-bold text-success">{customerData.orders?.length || 0}</h4>
                <small className="text-muted fw-semibold">Total Orders</small>
              </div>
            </div>
            <div className="col-6">
              <div className="text-center p-3 bg-info bg-opacity-10 rounded-4">
                <i className="bi bi-star-fill text-info fs-2 mb-2"></i>
                <h4 className="mb-1 fw-bold text-info">
                  {customerData.role === 'PREMIUM' ? 'Premium' : 'Standard'}
                </h4>
                <small className="text-muted fw-semibold">Member Status</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountOverviewCard;