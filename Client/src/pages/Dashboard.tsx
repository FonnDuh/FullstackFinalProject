import { useEffect, useState, type FunctionComponent } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";
import {
  clearCache,
  getMovieGenres,
  getTrendingMovies,
} from "../services/movieTmdbService";
import type { Media } from "../interfaces/Media/Media.interface";
import { errorMessage } from "../services/feedbackService";
import styles from "./Dashboard.module.css";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import type { Genre } from "../interfaces/Media/Genre.interface";

const Dashboard: FunctionComponent = () => {
  const [movies, setMovies] = useState<Media[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const { isDarkMode } = useDarkMode();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTrendingMovies();
        const genres = await getMovieGenres();

        setMovieGenres(genres.data.genres);
        setMovies(res.data.results);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        errorMessage("Failed to load trending movies.");
      }
    };
    fetchData();
  }, []);
  return (
    <div className={`${styles.dashboard} ${isDarkMode ? styles.dark : ""}`}>
      <h1 className={styles.heading}>Dashboard</h1>
      <p className={styles.welcome}>
        Welcome {user?.username} to your media dashboard!
      </p>
      <button className={styles.button} onClick={clearCache}>
        Clear
      </button>

      <section className={styles.trendingSection}>
        <h2 className={styles.sectionTitle}>Trending Movies</h2>
        {movies.length > 0 ? (
          <ScrollArea.Root className={styles.scrollRoot}>
            <ScrollArea.Viewport className={styles.scrollViewport}>
              <ul className={styles.movieList}>
                {movies.map((movie) => (
                  <li key={movie.id} className={styles.movieItem}>
                    <h3>{movie.title}</h3>
                    <img
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      className={styles.moviePoster}
                    />
                    <p>
                      {movie.genre_ids?.length
                        ? movie.genre_ids
                            .map(
                              (id) => movieGenres.find((g) => g.id === id)?.name
                            )
                            .join(", ")
                        : "No genres"}
                    </p>
                    <p>{movie.overview}</p>
                    <p>Release Date: {movie.release_date}</p>
                    <p>Rating: {movie.vote_average?.toFixed(2)} / 10</p>
                    <p>Votes: {movie.vote_count}</p>
                    <p>Popularity: {movie.popularity?.toFixed(2)}</p>
                  </li>
                ))}
              </ul>
            </ScrollArea.Viewport>
            <ScrollArea.Scrollbar
              orientation="vertical"
              className={styles.scrollbar}>
              <ScrollArea.Thumb className={styles.thumb} />
            </ScrollArea.Scrollbar>
          </ScrollArea.Root>
        ) : (
          <p>No trending movies available.</p>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
