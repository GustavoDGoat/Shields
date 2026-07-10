import { 
  BookOpen, 
  Target, 
  AlertTriangle, 
  BarChart3, 
  Users, 
  ShieldCheck 
} from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Bite-Sized Lessons",
    description: "Quick video tutorials and guides that fit between classes. Learn at your own pace, anywhere.",
  },
  {
    icon: Target,
    title: "Phishing Challenges",
    description: "Test yourself with realistic scam emails and texts. Can you spot the fakes before they fool you?",
  },
  {
    icon: AlertTriangle,
    title: "Report Suspicious Activity",
    description: "Found something sketchy? Report it easily and help keep your campus community safe.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description: "See how your skills improve over time with badges, scores, and completion tracking.",
  },
  {
    icon: Users,
    title: "Learn With Friends",
    description: "Compare scores with classmates and challenge each other to become security-savvy.",
  },
  {
    icon: ShieldCheck,
    title: "Security Dictionary",
    description: "Confused by tech jargon? Our glossary explains cybersecurity terms in plain English.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="absolute inset-0 grid-pattern opacity-20" />
      
      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-sm font-mono text-primary tracking-wider uppercase mb-4 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6">
            Everything You Need to{" "}
            <span className="gradient-text">Stay Safe Online</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Fun, interactive tools to protect yourself from hackers, scammers, and digital threats.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl bg-card border border-border transition-all duration-500 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className="mb-4 relative inline-block">
                <div className="p-3 rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors duration-300">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="absolute inset-0 blur-xl bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>

              {/* Hover Border Gradient */}
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
