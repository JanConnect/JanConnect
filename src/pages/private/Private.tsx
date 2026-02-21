import HeroSection from "./HeroSection";
import SocietySelection from "./SocietySelection";
import HowItWorks from "./HowItWorks";
import ServiceShowcase from "./ServiceShowcase";
import CommunityFeed from "./CommunityFeed";
import WorkerTransparency from "./WorkerTransparecy";
import Footer from "./Footer";

const Private = () => {
  return (
    <main className="bg-background">
      <HeroSection />
      <SocietySelection />
      <HowItWorks />
      <ServiceShowcase />
      <CommunityFeed />
      <WorkerTransparency />
      <Footer />
    </main>
  );
};

export default Private;