import { ToastContainer } from "react-toastify";
import "./App.css";
import "./styles/global.css";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard/Dashboard";
import NotFound from "./components/feedback/NotFound/NotFound";
import ScreenLoader from "./components/feedback/ScreenLoader/ScreenLoader";
import Layout from "./layouts/Default/Layout";
import Search from "./pages/Search/Search";
import MediaDetails from "./pages/MovieDetails/MediaDetails";
import Footer from "./components/common/Footer/Footer";
import ErrorBoundary from "./components/feedback/ErrorBoundary";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile/Profile";
import { AuthProvider } from "./providers/AuthProvider";

function App() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function initializeApp() {
      // Simulate data fetching or auth initialization
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Example: wait for auth or initial API calls before hiding loader
      setLoading(false);
    }

    initializeApp();
  }, []);

  if (loading) return <ScreenLoader />;

  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ErrorBoundary>
                    <Dashboard />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/search"
                element={
                  <ErrorBoundary>
                    <Search />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/tmdb/:id"
                element={
                  <ErrorBoundary>
                    <MediaDetails />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/login"
                element={
                  <ErrorBoundary>
                    <Login />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/register"
                element={
                  <ErrorBoundary>
                    <Register />
                  </ErrorBoundary>
                }
              />
              <Route
                path="/profile"
                element={
                  <ErrorBoundary>
                    <Profile />
                  </ErrorBoundary>
                }
              />
              <Route
                path="*"
                element={
                  <ErrorBoundary>
                    <NotFound />
                  </ErrorBoundary>
                }
              />
            </Routes>
            <Footer />
          </Layout>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;

/*
==========================================
📊 MediaVault Dashboard Layout Overview
==========================================

🟪 HEADER
- Welcome banner: "Good morning, [username]!"
- Subtitle: "Ready to dive into your media universe?"
- Top-right: Date and a "Keep tracking!" reminder

🟫 TOP STATS GRID (6 Cards)
- Watching [🔵]
- Completed [🟢]
- Plan to Watch [🟣]
- Hours Tracked [🟠]
- Favorites [🔴]
- Reviews [🟡]

Each stat card displays a count (default 0) and a themed icon.

⬛ MAIN CONTENT AREA (3 sections)
- 🖥️ Left Card: "No media in progress" → placeholder for currently tracked content
- 💬 Right Card: "No reviews yet" → encourages user to write reviews
- 🕒 Bottom Card: "No recent activity" → shows timeline of media activity

🟦 RIGHT SIDEBAR (Call-to-action)
- Button: "Discover New Media" [gradient styled]

⬜ LEFT NAVIGATION (Sidebar)
- Logo: "MediaVault" + tagline
- Menu:
  - Dashboard
  - Search
  - My Lists
  - Reviews
  - Favorites
  - Profile

🟨 QUICK STATS (left sidebar bottom)
- Completed count
- Hours tracked
- Favorites

🟪 FOOTER/USER TAGLINE
- Role-based label (e.g., "Media Enthusiast")
- Description: "Track your favorites"

==========================================
📝 Notes:
- Clean, minimal layout with neumorphic styling
- Great visual balance between stats and interactivity
- Each section encourages user engagement (add media, review, track)
==========================================
*/
