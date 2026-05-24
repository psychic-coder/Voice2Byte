"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import { config } from "@/data/axiosData";
import MenuSection from "@/src/components/MenuSection";
import CartSidebar from '@/src/components/CartSidebar';
import RestaurantHeroSection from "@/src/components/RestaurantHeroSection";
import Layout from "@/src/layouts/Layout";

const RestaurantCard = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);


const uniqueTags = useMemo(() => {
  return [...new Set(restaurant?.foodItems?.flatMap(item => item.tags) || [])];
}, [restaurant]);

const filteredItems = useMemo(() => {
  return activeTab === 'all' 
    ? restaurant?.foodItems || []
    : restaurant?.foodItems?.filter(item => item.tags.includes(activeTab)) || [];
}, [activeTab, restaurant]);

  const { totalItems, totalPrice } = useMemo(() => {
    return cart.reduce((acc, item) => ({
      totalItems: acc.totalItems + item.quantity,
      totalPrice: acc.totalPrice + (item.price * item.quantity)
    }), { totalItems: 0, totalPrice: 0 });
  }, [cart]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const id = searchParams.get('id');
      if (!id) {
        router.push('/');
        return;
      }

      try {
        const res = await axios.get(
          `http://localhost:4000/api/customer/getAllRestaurants/${id}`, 
          config
        );
        setRestaurant(res.data?.restaurant || null);
      } catch (err) {
        console.error('Error fetching restaurant:', err);
        setError('Failed to load restaurant details.');
      } finally {
        setLoading(false);
      }
    };

    AOS.init({ duration: 800, easing: 'ease-in-out', once: true });
    fetchRestaurant();
  }, [searchParams, router]);

  const handleCartUpdate = (item, operation = 'add') => {
    setCart(prevCart => {
      if (operation === 'remove') {
        const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
        if (existingItem?.quantity > 1) {
          return prevCart.map(cartItem =>
            cartItem.id === item.id 
              ? { ...cartItem, quantity: cartItem.quantity - 1 } 
              : cartItem
          );
        }
        return prevCart.filter(cartItem => cartItem.id !== item.id);
      }
      
      const existingItem = prevCart.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 } 
            : cartItem
        );
      }
      return [...prevCart, { ...item, quantity: 1 }];
    });
  };

  const handleCheckout = () => {
    // You can add additional logic here before checkout if needed
    router.push('/checkout');
  };

  if (loading) return <div className="text-center my-4">Loading...</div>;
  if (error) return <div className="text-danger text-center my-4">{error}</div>;
  if (!restaurant) return <div className="text-center my-4">Restaurant not found</div>;

  return (
    <Layout>
    <>
      
      <RestaurantHeroSection 
  restaurant={restaurant}
  backgroundImage="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
/>

      {/* Menu Section */}
      <MenuSection
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        uniqueTags={uniqueTags}
        filteredItems={filteredItems}
        handleCartUpdate={handleCartUpdate}
      />

    
      <motion.div 
        className="position-fixed bottom-0 end-0 m-4"
        whileHover={{ scale: 1.1 }}
      >
        <button 
          className="btn btn-primary btn-lg rounded-pill shadow-lg position-relative"
          onClick={() => setShowCart(true)}
        >
          <i className="fas fa-shopping-cart me-2" />
          View Cart
          {totalItems > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {totalItems}
            </span>
          )}
        </button>
      </motion.div>

   
      <CartSidebar
        showCart={showCart}
        setShowCart={setShowCart}
        cart={cart}
      />
    </>
    </Layout>
  );
};

export default RestaurantCard;