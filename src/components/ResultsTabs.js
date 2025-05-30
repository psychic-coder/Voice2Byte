const ResultsTabs = ({ activeTab, setActiveTab, searchResults }) => {
  return (
    <ul className="nav nav-tabs mb-4">
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'hotels' ? 'active text-warning' : ''}`}
          onClick={() => setActiveTab('hotels')}
        >
          Restaurants ({searchResults.hotels.length})
        </button>
      </li>
      <li className="nav-item">
        <button
          className={`nav-link ${activeTab === 'food' ? 'active text-warning' : ''}`}
          onClick={() => setActiveTab('food')}
        >
          Food Items ({searchResults.foodItems.length})
        </button>
      </li>
    </ul>
  );
};

export default ResultsTabs;