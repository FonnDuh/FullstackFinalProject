import { type FunctionComponent } from "react";
import { Link } from "react-router-dom";

const ContinueWatching: FunctionComponent = () => {
  return (
    <div className="dashboard__main-left card">
      <h2>No media in progress</h2>
      <p>Once you start tracking shows or movies they will appear here.</p>
      <Link className="btn-primary" to="/browse">
        Browse media
      </Link>
    </div>
  );
};

export default ContinueWatching;
