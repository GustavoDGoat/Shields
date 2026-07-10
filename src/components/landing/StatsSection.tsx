const stats = [
  { value: "93%", label: "Students Spot Scams After Training" },
  { value: "50K+", label: "Students Protected" },
  { value: "200+", label: "Universities & Colleges" },
  { value: "15min", label: "Average Lesson Length" },
];

const StatsSection = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5" />
      <div className="absolute inset-0 grid-pattern opacity-10" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="text-center group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="mb-2">
                <span className="text-4xl sm:text-5xl md:text-6xl font-bold gradient-text">
                  {stat.value}
                </span>
              </div>
              <p className="text-muted-foreground text-sm sm:text-base font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
