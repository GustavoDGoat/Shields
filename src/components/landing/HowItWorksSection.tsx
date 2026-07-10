import { UserPlus, GraduationCap, Target, TrendingUp } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up in Seconds",
    description: "Create your free account with your school email. No credit card needed, ever.",
  },
  {
    icon: GraduationCap,
    step: "02",
    title: "Watch & Learn",
    description: "Complete short video lessons on topics like password security, phishing, and safe browsing.",
  },
  {
    icon: Target,
    step: "03",
    title: "Test Your Skills",
    description: "Take interactive quizzes and phishing simulations to see if you can spot the threats.",
  },
  {
    icon: TrendingUp,
    step: "04",
    title: "Earn Your Badge",
    description: "Complete all modules to earn your cybersecurity awareness certificate.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-mono text-primary tracking-wider uppercase mb-4 block">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Become Cyber-Smart in{" "}
            <span className="gradient-text">Four Easy Steps</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            No tech expertise needed. Just a few minutes between classes.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent transform -translate-y-1/2" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div
                key={step.step}
                className="relative group"
              >
                {/* Step Number */}
                <div className="absolute -top-4 left-6 text-6xl font-bold text-secondary/50 select-none">
                  {step.step}
                </div>

                {/* Card */}
                <div className="relative p-6 pt-10 rounded-2xl bg-card border border-border transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 h-full">
                  {/* Icon */}
                  <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/10 border border-primary/20">
                    <step.icon className="h-6 w-6 text-primary" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Arrow (hidden on last item) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2 z-10">
                    <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
