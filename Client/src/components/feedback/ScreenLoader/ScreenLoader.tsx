import styles from "./ScreenLoader.module.css";

export default function ScreenLoader() {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Loading your dashboard...</p>
    </div>
  );
}
