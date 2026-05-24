"use client";

import { useState, useEffect, useRef } from "react";

export default function StatsCounter() {
  const [restaurants, setRestaurants] = useState(0);
  const [customers, setCustomers] = useState(0);
  const [rating, setRating] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCounters();
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [hasAnimated]);

  const animateCounters = () => {
    const duration = 2000;
    const frameRate = 1000 / 60;
    const totalFrames = Math.round(duration / frameRate);

    let frame = 0;

    const counter = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const easeOut = 1 - Math.pow(1 - progress, 4);

      setRestaurants(Math.floor(easeOut * 500));
      setCustomers(Math.floor(easeOut * 50));
      setRating(parseFloat((easeOut * 4.8).toFixed(1)));

      if (frame === totalFrames) {
        clearInterval(counter);
        setRestaurants(500);
        setCustomers(50);
        setRating(4.8);
      }
    }, frameRate);
  };

  return (
    <div ref={sectionRef} className="d-flex gap-5 pt-3">
      <div>
        <div className="display-5 fw-bold text-dark">{restaurants}+</div>
        <div className="small text-secondary">Restaurants</div>
      </div>
      <div>
        <div className="display-5 fw-bold text-dark">{customers}K+</div>
        <div className="small text-secondary">Happy Customers</div>
      </div>
      <div>
        <div className="display-5 fw-bold text-warning">{rating}</div>
        <div className="small text-secondary">Average Rating</div>
      </div>
    </div>
  );
}
