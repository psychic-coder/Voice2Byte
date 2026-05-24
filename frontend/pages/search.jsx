import Layout from "@/src/layouts/Layout";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { config } from "@/data/axiosData";

import { FaSearch } from "react-icons/fa";
import SearchForm from "@/src/components/SearchForm";
import RecentSearches from "@/src/components/RecentSearches";
import HotelCard from "@/src/components/HotelCard";
import FoodItemCard from "@/src/components/FoodItemCard";
import ResultsTabs from "@/src/components/ResultsTabs";

const Search = () => {
  const BASE_LINK = process.env.BACKEND_URL || "http://localhost:4000/api";
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("hotels");

  useEffect(() => {
    const fetchRecentSearches = async () => {
      try {
        const response = await axios.get(`${BASE_LINK}/search`, config);
        setRecentSearches(response.data.searches);
      } catch (error) {
        console.error("Error fetching recent searches:", error);
      }
    };
    fetchRecentSearches();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post(
        `${BASE_LINK}/search/add`,
        { query },
        config
      );
      setSearchResults(response.data);

      if (!recentSearches.includes(query)) {
        setRecentSearches((prev) => [query, ...prev].slice(0, 5));
      }
    } catch (error) {
      console.error("Error performing search:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearSearchHistory = async () => {
    try {
      await axios.delete(`${BASE_LINK}/search/clear`, config);
      setRecentSearches([]);
    } catch (error) {
      console.error("Error clearing search history:", error);
    }
  };

  const navigateToHotel = (hotelId) => {
    router.push(`/restaurant-card?id=${hotelId}`);
  };

  const navigateToFoodItem = (hotelId, itemId) => {
    router.push(`/restaurant-card?id=${hotelId}`);
  };

  return (
    <Layout>
      <div className="container py-4 ">
        <SearchForm
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
          isLoading={isLoading}
        />

        {recentSearches.length > 0 && (
          <RecentSearches
            recentSearches={recentSearches}
            clearSearchHistory={clearSearchHistory}
            setQuery={setQuery}
            handleSearch={handleSearch}
          />
        )}

        {searchResults ? (
          <div className="mt-5">
            <ResultsTabs
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              searchResults={searchResults}
            />

            {activeTab === "hotels" ? (
              <div className="row g-4">
                {searchResults.hotels.length > 0 ? (
                  searchResults.hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.restaurantId}
                      hotel={hotel}
                      navigateToHotel={navigateToHotel}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i
                      className="bi bi-building text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="mt-3 text-muted">
                      No restaurants found for your search
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="row g-4">
                {searchResults.foodItems.length > 0 ? (
                  searchResults.foodItems.map((item) => (
                    <FoodItemCard
                      key={item.itemId}
                      item={item}
                      navigateToFoodItem={navigateToFoodItem}
                    />
                  ))
                ) : (
                  <div className="col-12 text-center py-5">
                    <i
                      className="bi bi-egg-fried text-muted"
                      style={{ fontSize: "3rem" }}
                    ></i>
                    <p className="mt-3 text-muted">
                      No food items found for your search
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="row">
            <div className="col-12 text-center py-5">
              <div className="mb-4">
                <FaSearch
                  className="text-warning"
                  style={{ fontSize: "4rem" }}
                />
              </div>
              <h4 className="mb-3">What are you craving today?</h4>
              <p className="text-muted">
                Search for restaurants, cuisines, or specific food items to
                discover delicious options near you.
              </p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Search;
