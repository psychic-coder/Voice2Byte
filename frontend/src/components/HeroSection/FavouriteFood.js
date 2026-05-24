import Link from "next/link";

const FavoriteFood = () => {
  return (
    <section
      className="your-favorite-food gap"
      style={{ backgroundImage: "url(assets/img/background-1.png)" }}
    >
      <div className="container">
        <div className="row align-items-center">
          <div
            className="col-lg-5"
            data-aos="fade-up"
            data-aos-delay={200}
            data-aos-duration={300}
          >
            <div className="food-photo-section">
              <img
                alt="img"
                src="https://quickeat-react.vercel.app/assets/img/photo-4.png"
              />{" "}
              <a href="#" className="one">
                <i className="fa-solid fa-burger" />
                Burgers
              </a>{" "}
              <a href="#" className="two">
                <i className="fa-solid fa-cheese" />
                Steaks
              </a>{" "}
              <a href="#" className="three">
                <i className="fa-solid fa-pizza-slice" />
                Pizza
              </a>
            </div>
          </div>
          <div
            className="col-lg-6 offset-lg-1"
            data-aos="fade-up"
            data-aos-delay={300}
            data-aos-duration={400}
          >
            <div className="food-content-section">
              <h2>Food from your favorite restaurants to your table</h2>
              <p>
                Pretium lectus quam id leo in vitae turpis massa sed. Lorem
                donec massa sapien faucibus et molestie. Vitae elementum
                curabitur vitae nunc.
              </p>{" "}
              <Link href="checkout" className="button button-2">
                Order Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoriteFood;
