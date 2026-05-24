// import { restaurants } from "@/data/restaurants";
import Subscribe from "@/src/components/Subscribe";
import VoiceInput from "@/src/components/VoiceInput";
import Layout from "@/src/layouts/Layout";
import { useRouter } from "next/router";

import Link from "next/link";
import axios from "axios";
import { config } from "@/data/axiosData";
import { useEffect, useState } from "react";
import GetRestaurants from "@/src/components/GetRestaurants";
const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([]);
  const router = useRouter();
  const [loading,setLoading]=useState(true)
  const [error, setError] = useState(false);

 

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          "http://localhost:4000/api/customer/getAllRestaurants",
          config
        );
        
        setRestaurants(res.data.restaurants);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch restaurants:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, []); 

  return (
    <Layout>
      <section className="hero-section about gap">
        <div className="container">
          <div className="row align-items-center">
            <div
              className="col-lg-6"
              data-aos="fade-up"
              data-aos-delay={200}
              data-aos-duration={300}
            >
              <div className="about-text">
                <ul className="crumbs d-flex">
                  <li>
                    <Link href="/">Home</Link>
                  </li>
                  <li className="two">
                    <Link href="/">
                      <i className="fa-solid fa-right-long" />
                      Restaurants
                    </Link>
                  </li>
                </ul>
                <h2>Restaurants</h2>
                <p>
                  Egestas sed tempus urna et pharetra pharetra massa. Fermentum
                  posuere urna nec tincidunt praesent semper.
                </p>
                <VoiceInput />
              </div>
            </div>
            <div
              className="col-lg-6"
              data-aos="fade-up"
              data-aos-delay={300}
              data-aos-duration={400}
            >
              <div className="restaurants-girl-img food-photo-section">
                <img
                  alt="man"
                  src="https://quickeat-react.vercel.app/assets/img/photo-11.png"
                />{" "}
                <a href="#" className="one">
                  <i className="fa-solid fa-burger" />
                  Burgers
                </a>{" "}
                <a href="#" className="two">
                  <i className="fa-solid fa-drumstick-bite" />
                  Chicken
                </a>{" "}
                <a href="#" className="three">
                  <i className="fa-solid fa-cheese" />
                  Steaks
                </a>{" "}
                <a href="#" className="for">
                  <i className="fa-solid fa-pizza-slice" />
                  Fish
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        className="banner"
        data-aos="fade-up"
        data-aos-delay={200}
        data-aos-duration={300}
      >
        <div className="container">
          <div
            className="banner-img"
            style={{
              backgroundImage:
                "url(https://quickeat-react.vercel.app/assets/img/food-4.jpg)",
            }}
          >
            <div className="banner-logo">
              <h4>
                Restaurant
                <br />
                of the Month
                <span className="chevron chevron--left" />
              </h4>
              <div className="banner-wilmington">
                <img
                  alt="logo"
                  src="https://quickeat-react.vercel.app/assets/img/logo-s.jpg"
                />
                <h6>The Wilmington</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-6 col-lg-12">
                <div className="choose-lunches">
                  <h2>Choose 2 lunches</h2>
                  <h3>pay for one</h3>{" "}
                  <a href="#" className="button button-2 non">
                    Order Now
                    <i className="fa-solid fa-arrow-right" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* best-restaurants */}
      {/* best-restaurants */}

      <GetRestaurants restaurants={restaurants} />


      {/* subscribe-section */}
      <Subscribe />
    </Layout>
  );
};
export default Restaurants;
