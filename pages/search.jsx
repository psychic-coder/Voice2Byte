import Layout from '@/src/layouts/Layout'
import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import { config } from '@/data/axiosData'
 import styles from '../styles/search.module.css'

const SearchPage = () => {


    const BASE_LINK=process.env.BACKEND_URL||"http://localhost:4000/api"
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [recentSearches, setRecentSearches] = useState([])
  const [searchResults, setSearchResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('hotels')

  
  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await axios.get(`${BASE_LINK}/search`,config)
        setRecentSearches(response.data.searches)
      } catch (error) {
        console.error('Error fetching recent searches:', error)
      }
    }
    fetchRecentSearches()
  }, [])

 
  const handleSearch = async (e) => {
    e.preventDefault()
    if (!query.trim()) return

    setIsLoading(true)
    try { 
      const response = await axios.post(`http://localhost:4000/api/search/add`, { query },config)
      console.log(response)
      setSearchResults(response.data)

     
      if (!recentSearches.includes(query)) {
        setRecentSearches(prev => [query, ...prev].slice(0, 5))
      }
    } catch (error) {
      console.error('Error performing search:', error)
    } finally {
      setIsLoading(false)
    }
  }

 
  const clearSearchHistory = async () => {
    try {
      await axios.delete(`http://localhost:4000/api/search/clear`,config)
      setRecentSearches([])
    } catch (error) {
      console.error('Error clearing search history:', error)
    }
  }

  
  const navigateToHotel = (hotelId) => {
    router.push(`/hotel/${hotelId}`)
  }


  const navigateToFoodItem = (hotelId, itemId) => {
    router.push(`/hotel/${hotelId}/item/${itemId}`)
  }

  return (
    <Layout>
      <div className="container py-4">
        {/* Search Form */}
        <div className="row justify-content-center mb-5">
          <div className="col-lg-8">
            <form onSubmit={handleSearch} className="position-relative">
              <input
                type="text"
                className="form-control form-control-lg border-2 border-primary rounded-pill px-4 py-3 shadow-sm"
                placeholder="Search for restaurants or food items..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button
                type="submit"
                className="btn btn-primary rounded-pill position-absolute end-0 top-0 h-100 px-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                ) : (
                  <i className="bi bi-search"></i>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Recent Searches */}
        {recentSearches.length > 0 && (
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
                    className="btn btn-outline-secondary rounded-pill px-3"
                    onClick={() => {
                      setQuery(searchTerm)
                      // Trigger search when clicking a recent search term
                      const event = new Event('submit', { cancelable: true })
                      document.querySelector('form')?.dispatchEvent(event)
                    }}
                  >
                    {searchTerm}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {searchResults && (
          <div className="mt-5">
            {/* Results Tabs */}
            <ul className="nav nav-tabs mb-4">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'hotels' ? 'active' : ''}`}
                  onClick={() => setActiveTab('hotels')}
                >
                  Restaurants ({searchResults.hotels.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === 'food' ? 'active' : ''}`}
                  onClick={() => setActiveTab('food')}
                >
                  Food Items ({searchResults.foodItems.length})
                </button>
              </li>
            </ul>

            {/* Hotels Results */}
            {activeTab === 'hotels' && (
              <div className="row g-4">
                {searchResults.hotels.length > 0 ? (
                  searchResults.hotels.map((hotel) => (
                    <div key={hotel.restaurantId} className="col-md-6 col-lg-4">
                      <div 
                        className={`card h-100 border-0 shadow-sm overflow-hidden ${styles.hotelCard}`}
                        onClick={() => navigateToHotel(hotel.restaurantId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.cardImagePlaceholder}>
                          <div className={styles.imageOverlay}></div>
                          <div className={styles.ratingBadge}>
                            {hotel.rating > 0 ? (
                              <span className="badge bg-warning text-dark">
                                <i className="bi bi-star-fill me-1"></i>
                                {hotel.rating.toFixed(1)}
                              </span>
                            ) : (
                              <span className="badge bg-secondary">New</span>
                            )}
                          </div>
                        </div>
                        <div className="card-body">
                          <h5 className="card-title">{hotel.restaurantName}</h5>
                          <p className="card-text text-muted small mb-2">{hotel.restaurantDescription}</p>
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {hotel.restaurantCategories.slice(0, 3).map((category, idx) => (
                              <span key={idx} className="badge bg-light text-dark border">
                                {category}
                              </span>
                            ))}
                          </div>
                          <div className="d-flex align-items-center text-muted small">
                            <i className="bi bi-geo-alt me-1"></i>
                            <span>{hotel.restaurantAddress}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-building text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 text-muted">No restaurants found for your search</p>
                  </div>
                )}
              </div>
            )}

            {/* Food Items Results */}
            {activeTab === 'food' && (
              <div className="row g-4">
                {searchResults.foodItems.length > 0 ? (
                  searchResults.foodItems.map((item) => (
                    <div key={item.itemId} className="col-md-6 col-lg-4 col-xl-3">
                      <div 
                        className={`card h-100 border-0 shadow-sm overflow-hidden ${styles.foodCard}`}
                        onClick={() => navigateToFoodItem(item.hotelId, item.itemId)}
                        style={{ cursor: 'pointer' }}
                      >
                        <div className={styles.foodImageContainer}>
                          <img 
                            src={'https://images.unsplash.com/photo-1542367592-8849eb950fd8?q=80&w=3431&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'} 
                            alt={item.itemName}
                            className={`card-img-top ${styles.foodImage}`}
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/300x200?text=Food+Image'
                            }}
                          />
                        </div>
                        <div className="card-body">
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <h6 className="card-title mb-0">{item.itemName}</h6>
                            <span className="text-primary fw-bold">₹{item.itemPrice}</span>
                          </div>
                          <p className="small text-muted mb-2">From: {item.hotelName}</p>
                          <div className="d-flex flex-wrap gap-1">
                            {item.itemTags.slice(0, 2).map((tag, idx) => (
                              <span key={idx} className="badge bg-light text-dark border small">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i className="bi bi-egg-fried text-muted" style={{ fontSize: '3rem' }}></i>
                    <p className="mt-3 text-muted">No food items found for your search</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {!searchResults && (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="mb-4">
                <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              </div>
              <h4 className="mb-3">What are you craving today?</h4>
              <p className="text-muted">
                Search for restaurants, cuisines, or specific food items to discover delicious options near you.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}

export default SearchPage