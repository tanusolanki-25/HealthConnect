import About from "../pages/About";
import Features from "../pages/Features";
import HeroSection from "../pages/HeroSection";
import Footer from "./Footer"

const Home = () => {
  return (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto hide-scrollbar">
     <HeroSection />
     <About />
     <Features />
     <Footer />
    </div>
  );
};

export default Home;