import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import ThemeToggle from "../../components/common/ThemeToggle";
import { useDarkMode } from "../../hooks/useDarkMode";
import "./layout.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { isDarkMode } = useDarkMode();

  return (
    <div className={`layout ${isDarkMode ? "dark" : ""}`}>
      <aside className="sidebar">
        <div className="logo">MediaVault</div>
        <nav className="nav">
          <Link to="/" className="navLink">
            Dashboard
          </Link>
          <Link to="/search" className="navLink">
            Search
          </Link>
          <Link to="/watchlist" className="navLink">
            Watchlist
          </Link>
          <Link to="/favorites" className="navLink">
            Favorites
          </Link>
          <Link to="/about" className="navLink">
            About
          </Link>
        </nav>
        <div className="auth">
          <ThemeToggle />
          {user ? (
            <Link to="/profile" className="navLink">
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" className="navLink">
                Login
              </Link>
              <Link to="/register" className="navLink">
                Register
              </Link>
            </>
          )}
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
