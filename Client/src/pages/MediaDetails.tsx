import { useEffect, useState, type FunctionComponent } from "react";
import { errorMessage } from "../services/feedback.service";
import { useParams } from "react-router-dom";
import type { TmdbMovieDetails } from "../interfaces/Media/TmdbMovieDetails";
import styles from "./MovieDetails.module.css";
import { getMediaDetails } from "../services/tmdb/tmdb.service";

const MediaDetails: FunctionComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<TmdbMovieDetails>();

  useEffect(() => {
    if (!id) return;

    let isCancelled = false;
    const fetchData = async () => {
      try {
        const res = await getMediaDetails("movie", Number(id));
        if (!isCancelled) setMedia(res.data);
      } catch (error) {
        console.error("Error fetching media data:", error);
        errorMessage("Failed to load media details.");
      }
    };

    fetchData();

    return () => {
      isCancelled = true; // Prevents setState on unmounted component
    };
  }, [id]);

  if (!media) return <div>No Media Found</div>;

  const genres = media.genres.map((g) => g.name).join(", ");
  const countries = media.production_countries.map((c) => c.name).join(", ");

  return (
    <div className={styles.movieDetails}>
      <div className={styles.movieHeader}>
        <img
          className={styles.poster}
          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
          alt={media.title}
        />
        <div className={styles.movieBasic}>
          <h1 className={styles.title}>{media.title}</h1>
          {media.tagline && <p className={styles.tagline}>{media.tagline}</p>}
          <p className={styles.meta}>
            <span>{media.release_date.slice(0, 4)}</span> •{" "}
            <span>{media.runtime} min</span> • <span>{genres}</span>
          </p>
          <p className={styles.rating}>
            ⭐ {media.vote_average.toFixed(1)} / 10 ({media.vote_count} votes)
          </p>
        </div>
      </div>

      <div className={styles.overview}>
        <h2>Overview</h2>
        <p>{media.overview || "No overview available."}</p>
      </div>

      <div className={styles.keyFacts}>
        <h2>Key Facts</h2>
        <ul>
          <li>
            <strong>Status:</strong> {media.status}
          </li>
          <li>
            <strong>Release Date:</strong> {media.release_date}
          </li>
          <li>
            <strong>Original Language:</strong>{" "}
            {media.original_language.toUpperCase()}
          </li>
          <li>
            <strong>Country:</strong> {countries || "N/A"}
          </li>
          <li>
            <strong>Budget:</strong>{" "}
            {media.budget.toLocaleString() == "$0"
              ? media.budget.toLocaleString()
              : " - "}
          </li>
          <li>
            <strong>Revenue:</strong>{" "}
            {media.revenue.toLocaleString() == "$0"
              ? media.revenue.toLocaleString()
              : " - "}
          </li>
          {media.imdb_id && (
            <li>
              <strong>IMDB ID:</strong> {media.imdb_id}
            </li>
          )}
        </ul>
      </div>

      <div className={styles.production}>
        <h2>Production Companies</h2>
        <ul>
          {media.production_companies.map((c) => (
            <li key={c.id}>
              {c.name} ({c.origin_country})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MediaDetails;
