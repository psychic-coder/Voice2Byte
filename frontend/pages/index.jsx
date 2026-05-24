import BestRestaurants from "@/src/components/HeroSection/BestRestaurants";
import CountersSection from "@/src/components/HeroSection/CountersSection";
import FavoriteFood from "@/src/components/HeroSection/FavouriteFood";
import HeroSection from "@/src/components/HeroSection/HeroSection";
import HowItWorks from "@/src/components/HeroSection/HowItWorks";
import NewsSection from "@/src/components/HeroSection/NewsSection";
import Partnership from "@/src/components/HeroSection/Partnership";
import ReviewsSection from "@/src/components/HeroSection/ReviewsSection";
import Subscribe from "@/src/components/Subscribe";
import Layout from "@/src/layouts/Layout";
import { useSelector } from "react-redux";



const Index = () => {
  const { currentUser } = useSelector((state) => state.user);
  console.log(currentUser);

  return (
    <Layout>
      <HeroSection />
      <HowItWorks />
      <BestRestaurants />
      <FavoriteFood />
      <CountersSection />
      <ReviewsSection />
      <Partnership />
      <NewsSection />
      <Subscribe />
    </Layout>
  );
};

export default Index;
