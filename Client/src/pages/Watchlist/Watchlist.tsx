import { useEffect, useState } from "react";
import { getAllMediaForUser } from "../../services/userMedia.service";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import { useAuth } from "../../hooks/useAuth";
import { errorMessage } from "../../services/feedback.service";
import { Link } from "react-router-dom";
import "./Watchlist.css";

const Watchlist = () => {
  const { user } = useAuth();
  const [mediaList, setMediaList] = useState<UserMedia[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setMediaList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getAllMediaForUser()
      .then((res) => setMediaList(res.data))
      .catch((err) => {
        errorMessage("Failed to load your watchlist.");
        console.error(err);
        setMediaList([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const MediaStatus: Record<string, string> = {
    watching: "Watching",
    completed: "Completed",
    plan_to_watch: "Plan to Watch",
    dropped: "Dropped",
    on_hold: "On Hold",
  };

  if (!user) {
    return (
      <div className="watchlist-message">
        Please log in to view your watchlist.
      </div>
    );
  }

  if (loading) {
    return <div className="watchlist-message">Loading...</div>;
  }

  if (mediaList.length === 0) {
    return <div className="watchlist-message">Your watchlist is empty.</div>;
  }

  return (
    <div className="watchlist-container">
      <h1 className="watchlist-title">My Watchlist</h1>
      <ul className="watchlist-list">
        {mediaList.map((media) => (
          <li key={media.media_id} className="watchlist-item">
            <Link to={`/tmdb/${media.media_id}`} className="watchlist-link">
              <img
                src={`https://image.tmdb.org/t/p/w500${media.cover_url}`}
                alt={media.media_title}
                className="watchlist-poster"
              />
              <div className="watchlist-info">
                <h2 className="watchlist-media-title">{media.media_title}</h2>
                <p className="watchlist-media-type">{media.media_type}</p>
                {media.status && (
                  <p className="watchlist-media-status">
                    Status: {MediaStatus[media.status]}
                  </p>
                )}
                <p className="watchlist-media-favorite">
                  {media.is_favorite ? "★ Favorite" : "☆ Not Favorite"}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Watchlist;
