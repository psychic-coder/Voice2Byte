import Link from "next/link";

const Partnership = () => {
  const partnershipOptions = [
    {
      title: "Join Courier",
      image: "https://quickeat-react.vercel.app/assets/img/photo-6.jpg",
    },
    {
      title: "Join Merchant",
      image: "https://quickeat-react.vercel.app/assets/img/photo-7.jpg",
    },
  ];

  return (
    <section
      className="join-partnership gap"
      style={{ backgroundColor: "#363636" }}
    >
      <div className="container">
        <h2>Want to Join Partnership?</h2>
        <div className="row">
          {partnershipOptions.map((option, index) => (
            <div
              key={index}
              className="col-lg-6"
              data-aos="flip-up"
              data-aos-delay={200 + index * 100}
              data-aos-duration={300 + index * 100}
            >
              <div className="join-img">
                <img alt="img" src={option.image} />
                <div className="Join-courier">
                  <h3>{option.title}</h3>
                  <Link href="become-partner" className="button button-2">
                    Learn More <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partnership;
