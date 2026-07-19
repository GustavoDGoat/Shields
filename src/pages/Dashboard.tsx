import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardNav from "@/components/dashboard/DashboardNav";
import TrainingTab from "@/components/dashboard/TrainingTab";
import PhishingSimulationTab from "@/components/dashboard/phishing/PhishingSimulationTab";
import IncidentTrackingTab from "@/components/dashboard/incidents/IncidentTrackingTab";
import AnalyticsTab from "@/components/dashboard/analytics/AnalyticsTab";
import PostTestTab from "@/components/dashboard/post-test/PostTestTab";

const VALID_TABS = ["training", "incidents", "simulations", "analytics", "post-test"];

const Dashboard = () => {
  const { tab } = useParams<{ tab: string }>();
  const navigate = useNavigate();
  const activeTab = VALID_TABS.includes(tab || "") ? tab! : "training";

  // Redirect invalid or missing tabs to training
  useEffect(() => {
    if (!tab || !VALID_TABS.includes(tab)) {
      navigate("/dashboard/training", { replace: true });
    }
  }, [tab, navigate]);

  const setActiveTab = (newTab: string) => {
    navigate(`/dashboard/${newTab}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-background">
      <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-8 pb-24 md:pb-8">
        {activeTab === "training" && <TrainingTab />}
        {activeTab === "incidents" && <IncidentTrackingTab />}
        {activeTab === "simulations" && <PhishingSimulationTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
        {activeTab === "post-test" && <PostTestTab />}
      </main>
    </div>
  );
};

export default Dashboard;
