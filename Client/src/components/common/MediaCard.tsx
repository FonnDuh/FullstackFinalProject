import type { Media } from "../../interfaces/Media/Media.interface";
import type { Genre } from "../../interfaces/Media/Genre.interface";
import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./MediaCard.module.css";
import { useNavigate } from "react-router-dom";
import type { FunctionComponent } from "react";

interface MediaCardProps {
  media: Media;
  genres: Genre[];
}

const MediaCard: FunctionComponent<MediaCardProps> = ({
  media,
  genres = [],
}) => {
  const navigate = useNavigate();
  const displayTitle =
    media.title || media.name || media.original_name || "Untitled";

  const displayPoster = media.poster_path
    ? `https://image.tmdb.org/t/p/w300${media.poster_path}`
    : "/placeholder.jpg";

  const genreNames =
    media.genres && media.genres.length
      ? media.genres.join(", ")
      : genres && media.genre_ids?.length
      ? media.genre_ids
          .map((id) => genres.find((g) => g.id === id)?.name)
          .filter(Boolean)
          .join(", ")
      : "Unknown";

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className={styles.card}
            onClick={() => navigate(`/media/${media.id}`)}>
            <div className={styles.posterWrapper}>
              <img
                src={displayPoster}
                alt={displayTitle}
                className={styles.poster}
              />
              {media.vote_average !== undefined && (
                <div className={styles.ratingBadge}>
                  ⭐ {media.vote_average.toFixed(1)}
                </div>
              )}
            </div>

            <div className={styles.quickActions}>
              <button className={styles.quickButton} title="Add to Favorites">
                ❤️
              </button>
              <button className={styles.quickButton} title="Add to Watchlist">
                📌
              </button>
            </div>

            <div className={styles.content}>
              <h4 className={styles.title}>{displayTitle}</h4>
              <p className={styles.genres}>{genreNames}</p>
            </div>
          </div>
        </Tooltip.Trigger>

        <Tooltip.Portal>
          <Tooltip.Content
            className={styles.tooltip}
            side="bottom"
            sideOffset={8}>
            <p className={styles.tooltipTitle}>{displayTitle}</p>
            {media.overview && (
              <p className={styles.tooltipOverview}>{media.overview}</p>
            )}
            <div className={styles.tooltipMeta}>
              {media.release_date || media.first_air_date ? (
                <span>📅 {media.release_date || media.first_air_date}</span>
              ) : null}
              {media.vote_average !== undefined && (
                <span>⭐ {media.vote_average.toFixed(1)}</span>
              )}
              {media.vote_count !== undefined && (
                <span>👥 {media.vote_count} votes</span>
              )}
            </div>

            <Tooltip.Arrow className={styles.tooltipArrow} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default MediaCard;
