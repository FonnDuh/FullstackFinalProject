import { type FunctionComponent } from "react";
import { Link } from "react-router-dom";
import { useDarkMode } from "../../hooks/useDarkMode";

const NotFound: FunctionComponent<object> = () => {
  const { isDarkMode } = useDarkMode();

  return (
    <div
      className={`not-found-container ${
        isDarkMode ? "bg-dark text-white" : "bg-light text-dark"
      }`}>
      <h1 className="not-found-title">404</h1>
      <p className="not-found-message">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link
        to="/"
        className={`not-found-link ${isDarkMode ? "text-white" : "text-dark"}`}>
        Back Home
      </Link>
    </div>
  );
};

export default NotFound;
