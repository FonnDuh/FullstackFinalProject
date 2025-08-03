import { type FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";
import styles from "./NotFound.module.css";

const NotFound: FunctionComponent<object> = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={
        `${styles.notFoundContainer} ` +
        (isDarkMode
          ? `${styles.bgDark} ${styles.textWhite}`
          : `${styles.bgLight} ${styles.textDark}`)
      }>
      <h1 className={styles.notFoundTitle}>404</h1>
      <p className={styles.notFoundMessage}>
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className={
          `${styles.notFoundLink} ` +
          (isDarkMode ? styles.textWhite : styles.textDark)
        }>
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;
