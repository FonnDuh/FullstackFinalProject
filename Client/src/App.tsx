import { ToastContainer } from "react-toastify";
import "./App.css";
import "./styles/global.css";
import Default from "./layouts/Default/Layout";
import { AuthProvider } from "./context/AuthenticationContext";
import { BrowserRouter as Router } from "react-router-dom";
import { useDarkMode } from "./hooks/useDarkMode";
import { useEffect } from "react";

function App() {
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return (
    <>
      <ToastContainer />
      <AuthProvider>
        <Router>
          <Default />
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
