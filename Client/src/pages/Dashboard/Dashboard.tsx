import { type FunctionComponent, useEffect, useState, useMemo } from "react";
import { useAuth } from "../../hooks/useAuth";
import "./Dashboard.css";
import Footer from "../../components/common/Footer/Footer";
import WelcomeSection from "../../components/dashboard/WelcomeSection";
import StatsCards from "../../components/dashboard/StatsCards";
import ContinueWatching from "../../components/dashboard/ContinueWatching";
import RecentActivity from "../../components/dashboard/RecentActivity";
import { getAllMediaForUser } from "../../services/userMedia.service";
import { errorMessage } from "../../services/feedback.service";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";

const Dashboard: FunctionComponent = () => {
  const { user } = useAuth();
  const username = user?.username ?? "guest";

  const today = new Date();
  const formattedDate = today.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const [mediaList, setMediaList] = useState<UserMedia[]>([]);

  useEffect(() => {
    if (!user) {
      setMediaList([]);
      return;
    }

    getAllMediaForUser()
      .then((res) => setMediaList(res.data))
      .catch((err) => {
        console.error("Failed to load user media for dashboard:", err);
        errorMessage("Failed to load dashboard stats.");
        setMediaList([]);
      });
  }, [user]);

  const counts = useMemo(() => {
    const watching = mediaList.filter((m) => m.status === "watching").length;
    const completed = mediaList.filter((m) => m.status === "completed").length;
    const plan_to_watch = mediaList.filter(
      (m) => m.status === "plan_to_watch"
    ).length;
    const favorites = mediaList.filter((m) => Boolean(m.is_favorite)).length;

    let hours = 0;
    mediaList.forEach((m) => {
      if (typeof m.progress === "number" && m.progress_units) {
        if (m.progress_units === "hours") hours += m.progress;
        else if (m.progress_units === "minutes") hours += m.progress / 60;
      }
    });

    return {
      watching,
      completed,
      plan_to_watch,
      favorites,
      hours: Math.round(hours * 10) / 10,
    };
  }, [mediaList]);

  const stats = [
    { key: "watching", label: "Watching", icon: "🔵", count: counts.watching },
    {
      key: "completed",
      label: "Completed",
      icon: "🟢",
      count: counts.completed,
    },
    {
      key: "plan_to_watch",
      label: "Plan to Watch",
      icon: "🟣",
      count: counts.plan_to_watch,
    },
    { key: "hours", label: "Hours Tracked", icon: "🟠", count: counts.hours },
    {
      key: "favorites",
      label: "Favorites",
      icon: "🔴",
      count: counts.favorites,
    },
  ];

  return (
    <div className="dashboard">
      <WelcomeSection username={username} formattedDate={formattedDate} />

      <StatsCards stats={stats} />

      <main className="dashboard__main">
        <ContinueWatching />
        <RecentActivity />
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
