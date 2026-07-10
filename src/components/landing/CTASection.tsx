import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-accent/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 md:p-16 rounded-3xl bg-card/50 backdrop-blur-sm border border-border overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

            <div className="relative z-10 text-center">
              {/* Icon */}
              <div className="inline-flex p-4 rounded-2xl bg-primary/10 border border-primary/20 mb-6 animate-pulse-glow">
                <Shield className="h-10 w-10 text-primary" />
              </div>

              {/* Content */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
                Ready to Protect Your{" "}
                <span className="gradient-text">Digital Life?</span>
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Join thousands of students who've leveled up their cybersecurity skills. 
                It's free, it's quick, and it could save you from a major headache.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/dashboard">
                    Start Learning Free
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </Button>
                <Button variant="hero-outline" size="xl">
                  Explore Courses
                </Button>
              </div>

              {/* Trust Note */}
              <p className="mt-8 text-sm text-muted-foreground">
                100% free for students • No credit card • Takes just 15 minutes
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
