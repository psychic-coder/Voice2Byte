const HowItWorks = () => {
  const workSteps = [
    {
      number: "01",
      title: "Select Restaurant",
      description:
        "Non enim praesent elementum facilisis leo vel fringilla. Lectus proin nibh nisl condimentum id. Quis varius quam quisque id diam vel.",
      image: "https://quickeat-react.vercel.app/assets/img/Illustration-1.png",
    },
    {
      number: "02",
      title: "Select menu",
      description:
        "Eu mi bibendum neque egestas congue quisque. Nulla facilisi morbi tempus iaculis urna id volutpat lacus. Odio ut sem nulla pharetra diam sit amet.",
      image: "https://quickeat-react.vercel.app/assets/img/Illustration-2.png",
    },
    {
      number: "03",
      title: "Wait for delivery",
      description:
        "Nunc lobortis mattis aliquam faucibus. Nibh ipsum consequat nisl vel pretium lectus quam id leo. A scelerisque purus semper eget. Tincidunt arcu non.",
      image: "https://quickeat-react.vercel.app/assets/img/illustration-3.png",
    },
  ];

  return (
    <section className="works-section gap no-top">
      <div className="container">
        <div
          className="hading"
          data-aos="fade-up"
          data-aos-delay={200}
          data-aos-duration={300}
        >
          <h2>How it works</h2>
          <p>
            Magna sit amet purus gravida quis blandit turpis cursus. Venenatis
            tellus in
            <br /> metus vulputate eu scelerisque felis.
          </p>
        </div>
        <div className="row">
          {workSteps.map((step, index) => (
            <div
              key={index}
              className="col-lg-4 col-md-6 col-sm-12"
              data-aos="flip-up"
              data-aos-delay={200 + index * 100}
              data-aos-duration={300 + index * 100}
            >
              <div className="work-card">
                <img alt="img" src={step.image} />
                <h4>
                  <span>{step.number}</span> {step.title}
                </h4>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
