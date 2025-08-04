import { Link } from "react-router-dom";
import styles from "./layout.module.css";
import { useAuth } from "../../hooks/useAuth";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <svg viewBox="0 0 640 640" style={{ width: "50px" }}>
            <path d="M128 96C92.7 96 64 124.7 64 160L64 480C64 515.3 92.7 544 128 544C128 561.7 142.3 576 160 576C177.7 576 192 561.7 192 544L448 544C448 561.7 462.3 576 480 576C497.7 576 512 561.7 512 544C547.3 544 576 515.3 576 480L576 160C576 124.7 547.3 96 512 96L128 96zM320 320C320 284.7 291.3 256 256 256C220.7 256 192 284.7 192 320C192 355.3 220.7 384 256 384C291.3 384 320 355.3 320 320zM128 320C128 249.3 185.3 192 256 192C326.7 192 384 249.3 384 320C384 390.7 326.7 448 256 448C185.3 448 128 390.7 128 320zM512 272C512 289.8 502.3 305.3 488 313.6L488 392C488 405.3 477.3 416 464 416C450.7 416 440 405.3 440 392L440 313.6C425.7 305.3 416 289.8 416 272C416 245.5 437.5 224 464 224C490.5 224 512 245.5 512 272z" />
          </svg>{" "}
          MediaVault
        </div>
        <nav className={styles.nav}>
          <Link to="/">Dashboard</Link>
          <Link to="/search">Search</Link>
          <Link to="/watchlist">Watchlist</Link>
          <Link to="/favorites">Favorites</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className={styles.auth}>
          {user ? (
            <Link to="/profile">Profile</Link>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
