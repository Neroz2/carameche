
import HeroSection from "@/components/home/HeroSection";
import SeriesGrid from "@/components/home/SeriesGrid";
import { useEffect } from "react";

const Index = () => {
  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <SeriesGrid />
    </div>
  );
};

export default Index;
