import Link from "next/link";

const BestRestaurants = () => {
  const restaurants = [
    {
      name: "Kennington Lane Cafe",
      image: "https://quickeat-react.vercel.app/assets/img/logos-2.jpg",
      rating: 4,
      tags: ["american", "steakhouse", "seafood"],
      description:
        "Non enim praesent elementum facilisis leo vel fringilla. Lectus proin nibh nisl condimentum id. Quis varius quam quisque id diam vel.",
    },
    {
      name: "The Wilmington",
      image: "https://quickeat-react.vercel.app/assets/img/logos-1.jpg",
      rating: 5,
      tags: ["american", "steakhouse", "seafood"],
      description:
        "Vulputate enim nulla aliquet porttitor lacus luctus. Suscipit adipiscing bibendum est ultricies integer. Sed adipiscing diam donec adipiscing tristique.",
    },
    {
      name: "Kings Arms",
      image: "https://quickeat-react.vercel.app/assets/img/logos-1.jpg",
      rating: 4.5,
      tags: ["healthy", "steakhouse", "vegetarian"],
      description:
        "Tortor at risus viverra adipiscing at in tellus. Cras semper auctor neque vitae tempus. Dui accumsan sit amet nulla facilisi. Sed adipiscing diam donec adipiscing tristique.",
    },
  ];

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<i key={i} className="fa-solid fa-star" />);
    }

    if (hasHalfStar) {
      stars.push(<i key="half" className="fa-regular fa-star-half-stroke" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<i key={`empty-${i}`} className="fa-regular fa-star" />);
    }

    return stars;
  };

  return (
    <section className="best-restaurants gap" style={{ background: "#fcfcfc" }}>
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-lg-6"
            data-aos="flip-up"
            data-aos-delay={200}
            data-aos-duration={300}
          >
            <div className="city-restaurants">
              <h2>12 Best Restaurants in Your City</h2>
              <p>
                Magna sit amet purus gravida quis blandit turpis cursus.
                Venenatis tellus in metus vulputate.
              </p>
            </div>
          </div>
          {restaurants.map((restaurant, index) => (
            <div
              key={index}
              className="col-lg-6"
              data-aos="flip-up"
              data-aos-delay={300 + index * 100}
              data-aos-duration={400 + index * 100}
            >
              <div
                className={`logos-card ${
                  index === 1 ? "two" : index === 2 ? "three" : ""
                }`}
              >
                <img alt="logo" src={restaurant.image} />
                <div className="cafa">
                  <h4>
                    <Link href="restaurant-card">{restaurant.name}</Link>
                  </h4>
                  <div>{renderStars(restaurant.rating)}</div>
                  <div className="cafa-button">
                    {restaurant.tags.map((tag, tagIndex) => (
                      <a
                        key={tagIndex}
                        href="#"
                        className={
                          tagIndex === restaurant.tags.length - 1 ? "end" : ""
                        }
                      >
                        {tag}
                      </a>
                    ))}
                  </div>
                  <p>{restaurant.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="button-gap">
          <Link href="restaurants" className="button button-2 non">
            See All
            <i className="fa-solid fa-arrow-right" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BestRestaurants;
