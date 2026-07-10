import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, ArrowRight, Lock, Eye } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";

const HeroSection = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      setAuthModalOpen(true);
    }
  };

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background Elements */}
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        
        {/* Floating Icons */}
        <div className="absolute top-1/3 left-[10%] hidden lg:block animate-float" style={{ animationDelay: "1s" }}>
          <div className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
            <Lock className="h-8 w-8 text-primary" />
          </div>
        </div>
        <div className="absolute bottom-1/3 right-[10%] hidden lg:block animate-float" style={{ animationDelay: "2s" }}>
          <div className="p-4 rounded-2xl bg-card/50 backdrop-blur-sm border border-border">
            <Eye className="h-8 w-8 text-accent" />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary border border-border mb-8 animate-fade-up">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">
                Built for Students & Campus Life
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 animate-fade-up-delay-1">
              Level Up Your{" "}
              <span className="gradient-text">Cyber Security</span>{" "}
              Skills
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-up-delay-2">
              Learn to spot scams, protect your accounts, and stay safe online. 
              Interactive training designed for students who live their lives digitally.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up-delay-3">
              {user ? (
                <Button variant="hero" size="xl" asChild>
                  <Link to="/dashboard">
                    Go to Dashboard
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
              ) : (
                <Button variant="hero" size="xl" onClick={handleGetStarted}>
                  Start Learning Free
                  <ArrowRight className="h-5 w-5" />
                </Button>
              )}
              <Button variant="hero-outline" size="xl">
                See How It Works
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 pt-8 border-t border-border/50 animate-fade-up-delay-3">
              <p className="text-sm text-muted-foreground mb-6">
                Trusted by universities & colleges worldwide
              </p>
              <div className="flex flex-wrap items-center justify-center gap-8 opacity-60">
                {["State University", "Tech College", "Community College", "Online Academy"].map((name) => (
                  <div key={name} className="font-mono text-sm tracking-wider">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </section>
      
      <AuthModal open={authModalOpen} onOpenChange={setAuthModalOpen} />
    </>
  );
};

export default HeroSection;
