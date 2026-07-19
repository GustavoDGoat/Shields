import { Shield, BookOpen, AlertTriangle, Crosshair, BarChart3, Brain, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";

interface DashboardNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const tabs = [
  { id: "training", label: "Training", fullLabel: "Training & Awareness", icon: BookOpen },
  { id: "incidents", label: "Incidents", fullLabel: "Incident Tracking", icon: AlertTriangle },
  { id: "simulations", label: "Phishing", fullLabel: "Phishing Simulations", icon: Crosshair },
  { id: "analytics", label: "Analytics", fullLabel: "Analytics", icon: BarChart3 },
  { id: "post-test", label: "Post Test", fullLabel: "Post Test", icon: Brain },
];

const DashboardNav = ({ activeTab, setActiveTab }: DashboardNavProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Desktop Top Nav */}
      <nav className="hidden md:block border-b border-border/50 glass sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/landing" className="flex items-center gap-2 group">
              <div className="relative">
                <Shield className="w-8 h-8 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-lg group-hover:bg-primary/40 transition-all" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Cyber<span className="text-primary">Shield</span>
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                    activeTab === tab.id
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  )}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTabDesktop"
                      className="absolute inset-0 bg-primary/10 border border-primary/30 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  <tab.icon className="w-4 h-4 relative z-10" />
                  <span className="hidden lg:inline relative z-10">{tab.fullLabel}</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass border-t border-border/50">
        <div className="flex items-center justify-around h-16 px-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex flex-col items-center justify-center gap-0.5 flex-1 py-2 rounded-lg transition-all",
                activeTab === tab.id
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {activeTab === tab.id && (
                <motion.div
                  layoutId="activeTabMobile"
                  className="absolute inset-1 bg-primary/10 border border-primary/30 rounded-lg glow-stat-cyan"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <tab.icon className="w-5 h-5 relative z-10" />
              <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Top Bar (logo only) */}
      <nav className="md:hidden border-b border-border/50 glass sticky top-0 z-50">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/landing" className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-bold text-foreground">
              Cyber<span className="text-primary">Shield</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default DashboardNav;
