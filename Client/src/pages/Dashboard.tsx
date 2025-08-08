import { useEffect, useState, type FunctionComponent } from "react";
import { useAuth } from "../hooks/useAuth";
import type { Media } from "../interfaces/Media/Media.interface";
import { errorMessage } from "../services/feedback.service";
import "./Dashboard.css";
import type { Genre } from "../interfaces/Media/Genre.interface";
import {
  getMediaGenres,
  getTopRatedMedia,
  getTrendingMedia,
} from "../services/tmdb/tmdb.service";
import VerticalScroller from "../components/dashboard/VerticalScroller";

const Dashboard: FunctionComponent = () => {
  const [trendingMovies, setTrendingMovies] = useState<Media[]>([]);
  const [movieGenres, setMovieGenres] = useState<Genre[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Media[]>([]);
  const [movieTimeframe, setMovieTimeframe] = useState<"day" | "week">("day");

  const [trendingTv, setTrendingTv] = useState<Media[]>([]);
  const [topRatedTv, setTopRatedTv] = useState<Media[]>([]);
  const [tvGenres, setTvGenres] = useState<Genre[]>([]);
  const [tvTimeframe, setTvTimeframe] = useState<"day" | "week">("day");

  const { user } = useAuth();

  type MediaType = "movie" | "tv";
  type Timeframe = "day" | "week";

  const fetchStaticData = async (
    type: MediaType,
    setTopRated: React.Dispatch<React.SetStateAction<Media[]>>,
    setGenres: React.Dispatch<React.SetStateAction<Genre[]>>
  ) => {
    try {
      const [topRated, genres] = await Promise.all([
        getTopRatedMedia(type),
        getMediaGenres(type),
      ]);

      setTopRated(topRated.data.results);
      setGenres(genres.data.genres);
    } catch (error) {
      console.error(`Error fetching ${type} static data:`, error);
      errorMessage(`Failed to load ${type} static data.`);
    }
  };

  const fetchTrendingData = async (
    type: MediaType,
    timeframe: Timeframe,
    setTrending: React.Dispatch<React.SetStateAction<Media[]>>
  ) => {
    try {
      const trending = await getTrendingMedia(type, timeframe);
      setTrending(trending.data.results);
    } catch (error) {
      console.error(`Error fetching ${type} trending:`, error);
      errorMessage(`Failed to load ${type} trending.`);
    }
  };

  // ===== Effects =====

  // Static data (only once)
  useEffect(() => {
    fetchStaticData("movie", setTopRatedMovies, setMovieGenres);
    fetchStaticData("tv", setTopRatedTv, setTvGenres);
  }, []);

  // Trending movies (updates on movieTimeframe change)
  useEffect(() => {
    fetchTrendingData("movie", movieTimeframe, setTrendingMovies);
  }, [movieTimeframe]);

  // Trending TV (updates on tvTimeframe change)
  useEffect(() => {
    fetchTrendingData("tv", tvTimeframe, setTrendingTv);
  }, [tvTimeframe]);

  return (
    <div className="dashboard">
      <h1 className="heading">Dashboard</h1>
      <p className="welcome">
        Welcome, {user ? user?.username : "guest"} to your media dashboard!
      </p>
      <VerticalScroller
        mediaType="Trending - Movies"
        media={trendingMovies}
        genres={movieGenres}
        timeFrame={movieTimeframe}
        setTimeframe={setMovieTimeframe}
      />
      <VerticalScroller
        mediaType="Trending - Series"
        media={trendingTv}
        genres={tvGenres}
        timeFrame={tvTimeframe}
        setTimeframe={setTvTimeframe}
      />
      <VerticalScroller
        mediaType="Top Rated - Movies"
        media={topRatedMovies}
        genres={movieGenres}
      />
      <VerticalScroller
        mediaType="Top Rated - Series"
        media={topRatedTv}
        genres={tvGenres}
      />
    </div>
  );
};

export default Dashboard;
