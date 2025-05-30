import { FaSearch } from 'react-icons/fa';

const SearchForm = ({ query, setQuery, handleSearch, isLoading }) => {
  return (
    <div className="row justify-content-center mb-5">
      <div className="col-lg-8">
        <form onSubmit={handleSearch} className="position-relative">
          <input
            type="text"
            className="form-control form-control-lg border-2 border-warning rounded-pill px-4 py-3 shadow-sm bg-light"
            placeholder="Search for restaurants or food items..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button
            type="submit"
            className="btn btn-warning rounded-pill position-absolute end-0 top-0 h-100 px-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            ) : (
              <FaSearch />
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;