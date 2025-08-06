import { useEffect, useState, type FunctionComponent } from "react";
import { useAuth } from "../hooks/useAuth";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import type { Media } from "../interfaces/Media/Media.interface";
import { errorMessage } from "../services/feedback.service";
import "./Dashboard.css";
import type { Genre } from "../interfaces/Media/Genre.interface";
import MediaCard from "../components/common/MediaCard";
import ErrorBoundary from "../components/feedback/ErrorBoundary";
import {
  getMediaGenres,
  getTrendingMedia,
} from "../services/tmdb/tmdb.service";

const Dashboard: FunctionComponent = () => {
  const [movies, setMovies] = useState<Media[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getTrendingMedia("movie", "day");
        const genres = await getMediaGenres("movie");

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
    <div className="dashboard">
      <h1 className="heading">Dashboard</h1>
      <p className="welcome">
        Welcome, {user ? user?.username : "guest"} to your media dashboard!
      </p>
      <section className="trendingSection">
        <h2 className="sectionTitle">Trending media</h2>
        <ErrorBoundary>
          {movies.length > 0 ? (
            <ScrollArea.Root className="scrollRoot">
              <ScrollArea.Viewport className="scrollViewport">
                <ul className="mediaList">
                  {movies.map((movie) => (
                    <li key={movie.id}>
                      <MediaCard media={movie} genres={movieGenres} />
                    </li>
                  ))}
                </ul>
              </ScrollArea.Viewport>
              <ScrollArea.Scrollbar
                orientation="vertical"
                className="scrollbar">
                <ScrollArea.Thumb className="thumb" />
              </ScrollArea.Scrollbar>
            </ScrollArea.Root>
          ) : (
            <p>No media available.</p>
          )}
        </ErrorBoundary>
      </section>
    </div>
  );
};

export default Dashboard;
