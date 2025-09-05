import type { Media } from "../../../interfaces/Media/Media.interface";
import type { Genre } from "../../../interfaces/Media/Genre.interface";
import * as Tooltip from "@radix-ui/react-tooltip";
import styles from "./MediaCard.module.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, type FunctionComponent } from "react";

interface MediaCardProps {
  media: Media;
  genres: Genre[];
}

const MediaCard: FunctionComponent<MediaCardProps> = ({
  media,
  genres = [],
}) => {
  const navigate = useNavigate();
  const textRef = useRef<HTMLParagraphElement>(null);

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

  useEffect(() => {
    const el = textRef.current;
    if (!el || !el.parentElement) return;

    const parent = el.parentElement;
    const diff = el.scrollWidth - parent.clientWidth;

    if (diff > 0) {
      el.style.setProperty("--scroll-diff", `${diff}px`);
      el.style.animation =
        "scroll-back-forth 6s ease-in-out infinite alternate";
    } else {
      el.style.animation = "none";
    }
  }, [genreNames]);

  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div
            className={styles.card}
            onClick={() => navigate(`/tmdb/${media.id}`)}>
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
            <div className={styles.content}>
              <h4 className={styles.title}>{displayTitle}</h4>
              <p className={styles.genres} ref={textRef}>
                {genreNames}
              </p>
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
