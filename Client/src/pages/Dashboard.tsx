import { useEffect, useState, type FunctionComponent } from "react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useAuth } from "../hooks/useAuth";
import {
  getMovieGenres,
  getTrendingMovies,
} from "../services/movieTmdbService";
import type { Media } from "../interfaces/Media/Media.interface";
import { errorMessage } from "../services/feedbackService";
import styles from "./Dashboard.module.css";
import type { Genre } from "../interfaces/Media/Genre.interface";
import MediaCard from "../components/common/MediaCard";
import ErrorBoundary from "../components/common/ErrorBoundary";

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
      <section className={styles.trendingSection}>
        <h2 className={styles.sectionTitle}>Trending media</h2>
        <ErrorBoundary>
          <MediaCard media={movies} genres={movieGenres} />
        </ErrorBoundary>
      </section>
    </div>
  );
};

export default Dashboard;
