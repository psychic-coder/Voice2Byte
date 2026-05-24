import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { restaurants } from "@/data/restaurants";
import Item from "./Item";

const RestaurantCardTab = (item) => {
  console.log(item);
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("breakfast");
  const [restaurant, setRestaurant] = useState(null);

  useEffect(() => {
    if (router.isReady) {
      const { name } = router.query;

      if (name) {
        
        const queryName = name.toLowerCase().replace(/\s/g, "");

        const found = restaurants.find((r) => {
          const normalizedName = r.name.toLowerCase().replace(/\s/g, "");
          return normalizedName === queryName;
        });

        setRestaurant(found);
      }
    }
  }, [router.isReady, router.query]);

  if (!restaurant) {
    return (
      <div className="text-center mt-10">
        <p>Restaurant not found or loading...</p>
      </div>
    );
  }

  return (
    <section className="tabs gap">
      <div className="container">
        <div className="tabs-img-back">
          <div className="row">
            <div className="col-lg-12">
              <div
                className="Provides"
                data-aos="fade-up"
                data-aos-delay={200}
                data-aos-duration={300}
              >
                <div className="nav nav-pills me-3" role="tablist">
                  {["breakfast", "lunch", "dinner"].map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      className={`nav-link ${activeTab === cat ? "active" : ""}`}
                      onClick={() => setActiveTab(cat)}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
                <div className="like-meal">
                  <a href="#">
                    <i className="fa-solid fa-heart" /> Like Meals
                  </a>
                </div>
              </div>
            </div>

            <div className="col-lg-12">
              <div className="tab-content">
                {["breakfast", "lunch", "dinner"].map((cat) => (
                  <div
                    key={cat}
                    className={`tab-pane fade ${activeTab === cat ? "show active" : ""}`}
                  >
                    <div className="row">
                      {restaurant.category.includes(cat) ? (
                        restaurant.menu
                        .filter((item) => Array.isArray(item.category) ? item.category.includes(cat) : item.category === cat)
                          .slice(0, 6)
                          .map((menuItem, idx) => (
                            <Item item={menuItem} key={idx} />
                          ))
                      ) : (
                        <p className="text-center mt-3">No {cat} items available.</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RestaurantCardTab;
