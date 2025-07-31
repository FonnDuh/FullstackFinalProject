import type { FunctionComponent } from "react";

import styles from "./MediaCard.module.css";
import type { Media } from "../../interfaces/Media/Media.interface";
import type { Genre } from "../../interfaces/Media/Genre.interface";

interface MediaCardProps {
  media: Media;
  genres: Genre[];
}

const MediaCard: FunctionComponent<MediaCardProps> = ({
  media,
  genres = null,
}) => {
  return (
    <>
      <div className="wrapper">
        <li key={media.id} className={styles.mediaItem}>
          <h3>{media.title}</h3>
          <img
            src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
            alt={media.title}
            className={styles.mediaPoster}
          />
          <p>
            {genres && media.genre_ids?.length
              ? media.genre_ids
                  .map((id) => genres.find((g) => g.id === id)?.name)
                  .join(", ")
              : "No genres"}
          </p>
          <p>{media.overview}</p>
          <p>Release Date: {media.release_date}</p>
          <p>Rating: {media.vote_average?.toFixed(2)} / 10</p>
          <p>Votes: {media.vote_count}</p>
          <p>Popularity: {media.popularity?.toFixed(2)}</p>
        </li>
      </div>
    </>
  );
};

export default MediaCard;
