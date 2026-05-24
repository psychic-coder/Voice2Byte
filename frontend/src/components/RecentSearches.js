const RecentSearches = ({ recentSearches, clearSearchHistory, setQuery, handleSearch }) => {
  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Recent Searches</h5>
          <button 
            onClick={clearSearchHistory}
            className="btn btn-sm btn-outline-danger"
          >
            Clear All
          </button>
        </div>
        <div className="d-flex flex-wrap gap-2">
          {recentSearches.map((searchTerm, index) => (
            <button
              key={index}
              className="btn btn-outline-warning rounded-pill px-3"
              onClick={() => {
                setQuery(searchTerm);
                const event = new Event('submit', { cancelable: true });
                document.querySelector('form')?.dispatchEvent(event);
              }}
            >
              {searchTerm}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentSearches;