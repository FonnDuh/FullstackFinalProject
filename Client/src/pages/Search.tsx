import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import { searchMovies } from "../services/movieTmdbService";
import type { Media } from "../interfaces/Media/Media.interface";
import ErrorBoundary from "../components/feedback/ErrorBoundary";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import styles from "./Search.module.css";
import MediaCard from "../components/common/MediaCard";

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
    searchMovies(debouncedSearchQuery)
      .then((results) => setMedia(results.data.results))
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
          placeholder="Search for a movie..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <span>Search media by title</span>
        <i></i>
      </div>

      {loading ? (
        <div className="display-5">Loading...</div>
      ) : media.length === 0 && debouncedSearchQuery ? (
        <div className="display-5">No movies found</div>
      ) : (
        <ErrorBoundary>
          {media.length > 0 ? (
            <ScrollArea.Root className={styles.scrollRoot}>
              <ScrollArea.Viewport className={styles.scrollViewport}>
                <ul className={styles.mediaList}>
                  {media.map((movie) => (
                    <li key={movie.id}>
                      <MediaCard media={movie} genres={[]} />
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
            <p>No media available.</p>
          )}
        </ErrorBoundary>
      )}
    </>
  );
};

export default Search;
