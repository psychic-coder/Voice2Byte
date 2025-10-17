import Link from "next/link";

const NewsSection = () => {
  const mainNews = {
    image: "https://quickeat-react.vercel.app/assets/img/photo-8.jpg",
    categories: ["news", "VoiceToByte"],
    title: "We Have Received An Award For The Quality Of Our Work",
    description:
      "Donec adipiscing tristique risus nec feugiat in fermentum. Sapien eget mi proin sed libero. Et magnis dis parturient montes nascetur. Praesent semper feugiat nibh sed pulvinar proin gravida.",
    author: "VoiceToByte",
    date: "01.Jan. 2022",
    views: "132",
  };

  const sideNews = [
    {
      image: "https://quickeat-react.vercel.app/assets/img/food-1.jpg",
      categories: ["restaurants", "cooking"],
      title: "With VoiceToByte you can order food for the whole day",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor...",
      author: "VoiceToByte",
      date: "01.Jan. 2022",
      views: "132",
    },
    {
      image: "https://quickeat-react.vercel.app/assets/img/food-1.jpg",
      categories: ["restaurants", "cooking"],
      title: "127+ Couriers On Our Team!",
      description:
        "Urna condimentum mattis pellentesque id nibh tortor id aliquet. Tellus at urna condimentum mattis...",
      author: "VoiceToByte",
      date: "01.Jan. 2022",
      views: "132",
    },
    {
      image: "https://quickeat-react.vercel.app/assets/img/food-3.jpg",
      categories: ["restaurants", "cooking"],
      title: "Why You Should Optimize Your Menu for Delivery",
      description:
        "Enim lobortis scelerisque fermentum dui. Sit amet cursus sit amet dictum sit amet. Rutrum tellus...",
      author: "VoiceToByte",
      date: "01.Jan. 2022",
      views: "132",
    },
  ];

  const NewsMeta = ({ author, date, views }) => (
    <ul className="data">
      <li>
        <h6>
          <i className="fa-solid fa-user" />
          by {author}
        </h6>
      </li>
      <li>
        <h6>
          <i className="fa-regular fa-calendar-days" />
          {date}
        </h6>
      </li>
      <li>
        <h6>
          <i className="fa-solid fa-eye" />
          {views}
        </h6>
      </li>
    </ul>
  );

  return (
    <section className="news-section gap">
      <div className="container">
        <h2>Latest news and events</h2>
        <div className="row">
          <div
            className="col-xl-6 col-lg-12"
            data-aos="flip-up"
            data-aos-delay={200}
            data-aos-duration={300}
          >
            <div className="news-posts-one">
              <img alt="man" src={mainNews.image} />
              <div className="quickeat">
                {mainNews.categories.map((category, index) => (
                  <a key={index} href="#">
                    {category}
                  </a>
                ))}
              </div>
              <h3>{mainNews.title}</h3>
              <p>{mainNews.description}</p>
              <Link href="/single-blog">
                Read More
                <i className="fa-solid fa-arrow-right" />
              </Link>
              <NewsMeta
                author={mainNews.author}
                date={mainNews.date}
                views={mainNews.views}
              />
            </div>
          </div>
          <div
            className="col-xl-6 col-lg-12"
            data-aos="flip-up"
            data-aos-delay={300}
            data-aos-duration={400}
          >
            {sideNews.map((news, index) => (
              <div
                key={index}
                className={`news-post-two ${
                  index === sideNews.length - 1 ? "end" : ""
                }`}
              >
                <img alt="food-img" src={news.image} />
                <div className="news-post-two-data">
                  <div className="quickeat">
                    {news.categories.map((category, catIndex) => (
                      <a key={catIndex} href="#">
                        {category}
                      </a>
                    ))}
                  </div>
                  <h6>
                    <Link href="single-blog">{news.title}</Link>
                  </h6>
                  <p>{news.description}</p>
                  <NewsMeta
                    author={news.author}
                    date={news.date}
                    views={news.views}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsSection;
