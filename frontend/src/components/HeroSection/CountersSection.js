import { useState, useEffect, useRef } from "react";

const CountersSection = () => {
  const [counts, setCounts] = useState([0, 0, 0]);
  const [hasAnimated, setHasAnimated] = useState(false);
  const sectionRef = useRef(null);

  const counters = [
    { number: 976, label: "Satisfied\nCustomer" },
    { number: 12, label: "Best\nRestaurants" },
    { number: 3, label: "Food\nDelivered", suffix: "k+" },
  ];

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

      setCounts([
        Math.floor(easeOut * 976),
        Math.floor(easeOut * 12),
        Math.floor(easeOut * 1),
      ]);

      if (frame === totalFrames) {
        clearInterval(counter);
        setCounts([976, 12, 1]);
      }
    }, frameRate);
  };

  return (
    <section ref={sectionRef} className="py-5 py-md-6 bg-white">
      <div className="container">
        <div className="row align-items-center g-4">
          <div className="col-12 col-md-6 col-lg-3 text-center text-md-start">
            <h2 className="h1 fw-bold text-dark">Service shows good taste.</h2>
          </div>

          {counters.map((counter, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-3">
              <div className="text-center">
                <div className="bg-white rounded-3 p-4 shadow-sm hover-shadow transition-all border">
                  <div className="d-flex align-items-baseline justify-content-center gap-1 mb-3">
                    <h2 className="display-4 fw-bold text-warning mb-0">
                      {counts[index]}
                    </h2>
                    {counter.suffix && (
                      <span className="fs-1 fw-semibold text-warning">
                        {counter.suffix}
                      </span>
                    )}
                  </div>
                  <p className="text-secondary fw-medium fs-5 mb-0">
                    {counter.label.split("\n").map((line, i) => (
                      <span key={i}>
                        {line}
                        {i === 0 && <br />}
                      </span>
                    ))}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .py-md-6 {
          padding-top: 6rem !important;
          padding-bottom: 6rem !important;
        }
        @media (min-width: 768px) {
          .py-md-6 {
            padding-top: 6rem !important;
            padding-bottom: 6rem !important;
          }
        }
        .hover-shadow {
          transition: box-shadow 0.3s ease-in-out;
        }
        .hover-shadow:hover {
          box-shadow: 0 0.5rem 1rem rgba(255, 193, 7, 0.15) !important;
        }
        .transition-all {
          transition: all 0.3s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default CountersSection;
