import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import { searchMovies } from "../services/movieTmdbService";
import type { Media } from "../interfaces/Media/Media.interface";
import ErrorBoundary from "../components/feedback/ErrorBoundary";
import styles from "./Search.module.css";
import SearchResults from "../components/search/SearchResults";
import { searchTv } from "../services/tvTmdbService";

const Search: FunctionComponent = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    if (!debouncedSearchQuery.trim()) {
      setMedia([]);
      return;
    }
    setLoading(true);
    Promise.all([
      searchMovies(debouncedSearchQuery),
      searchTv(debouncedSearchQuery),
    ])
      .then(([movieResults, tvResults]) => {
        const movies = movieResults.data.results.map((item: Media) => ({
          ...item,
          type: "movie",
        }));

        const tvShows = tvResults.data.results.map((item: Media) => ({
          ...item,
          type: "tv",
        }));

        const combined = [...movies, ...tvShows].sort(
          (a, b) => (b.popularity ?? 0) - (a.popularity ?? 0)
        );
        setMedia(combined);
      })
      .finally(() => setLoading(false));
  }, [debouncedSearchQuery]);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  return (
    <>
      <div className={styles.searchContainer}>
        <input
          type="text"
          id="search"
          placeholder="Search for media..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <h2>Search media by title</h2>
        <i></i>
      </div>

      {loading ? (
        <div className="display-5">Loading...</div>
      ) : media.length === 0 && debouncedSearchQuery ? (
        <div className="display-5">No movies found</div>
      ) : (
        <ErrorBoundary>
          <SearchResults media={media} />
        </ErrorBoundary>
      )}
    </>
  );
};

export default Search;
