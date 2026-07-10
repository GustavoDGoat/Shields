import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import StatsSection from "@/components/landing/StatsSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </main>
    );
  }

  if (user) {
    return <Navigate to="/dashboard/training" replace />;
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <StatsSection />
      <HowItWorksSection />
      <CTASection />
      <Footer />
    </main>
  );
};

export default Index;
