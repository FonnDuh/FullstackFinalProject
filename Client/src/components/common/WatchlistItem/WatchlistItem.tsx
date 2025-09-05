import { Link } from "react-router-dom";
import type { UserMedia } from "../../../interfaces/UserMedia/UserMedia.interface";
import type { FunctionComponent } from "react";
import "./WatchlistItem.css"

interface WatchlistItemProps {
  media: UserMedia;
}

const MediaStatus: Record<string, string> = {
  watching: "Watching",
  completed: "Completed",
  plan_to_watch: "Plan to Watch",
  dropped: "Dropped",
  on_hold: "On Hold",
};

const WatchlistItem: FunctionComponent<WatchlistItemProps> = ({ media }) => {
  return (
    <div className="watchlist-item">
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
    </div>
  );
};

export default WatchlistItem;
