// components/Layout/Layout.tsx
import { Link } from "react-router-dom";
import styles from "./layout.module.css";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.logo}>MyApp</div>
        <nav className={styles.nav}>
          <Link to="/">Dashboard</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className={styles.auth}>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </div>
      </aside>
      <main className={styles.main}>{children}</main>
    </div>
  );
}
