import {
  useCallback,
  useEffect,
  useState,
  type FunctionComponent,
} from "react";
import styles from "./Search.module.css";
import SearchFilters from "../../components/search/SearchFilters";
import type { Media } from "../../interfaces/Media/Media.interface";
import { searchMedia } from "../../services/tmdb/tmdb.service";
import ErrorBoundary from "../../components/feedback/ErrorBoundary";
import SearchResults from "../../components/search/SearchResults";

const Search: FunctionComponent = () => {
  const [media, setMedia] = useState<Media[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [mediaType, setMediaType] = useState<
    "all" | "movie" | "tv" | "book" | "anime" | "game"
  >("all");
  const [minRating, setMinRating] = useState<number | "">("");
  const [maxRating, setMaxRating] = useState<number | "">("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  type Sort =
    | "popularity_desc"
    | "popularity_asc"
    | "rating_desc"
    | "rating_asc"
    | "title_asc"
    | "title_desc"
    | "release_desc"
    | "release_asc";

  const [sort, setSort] = useState<Sort>("popularity_desc");

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
      searchMedia("movie", debouncedSearchQuery),
      searchMedia("tv", debouncedSearchQuery),
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

  const displayedMedia = media
    .filter((m) => {
      if (mediaType !== "all" && m.type !== mediaType) return false;
      if (minRating !== "") {
        const v =
          typeof m.vote_average === "number"
            ? m.vote_average
            : m.popularity ?? 0;
        if (v < (minRating as number)) return false;
      }
      if (maxRating !== "") {
        const v =
          typeof m.vote_average === "number"
            ? m.vote_average
            : m.popularity ?? 0;
        if (v > (maxRating as number)) return false;
      }
      if (dateFrom && m.release_date) {
        if (Date.parse(m.release_date) < Date.parse(dateFrom)) return false;
      }
      if (dateTo && m.release_date) {
        if (Date.parse(m.release_date) > Date.parse(dateTo)) return false;
      }
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const title = (m.title || m.name || "").toLowerCase();
        const overview = (m.overview || "").toLowerCase();
        if (
          !title.includes(q) &&
          !overview.includes(q) &&
          !(m.id && m.id.toString().includes(q))
        )
          return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sort === "popularity_desc")
        return (b.popularity ?? 0) - (a.popularity ?? 0);
      if (sort === "popularity_asc")
        return (a.popularity ?? 0) - (b.popularity ?? 0);
      if (sort === "rating_desc")
        return (b.vote_average ?? 0) - (a.vote_average ?? 0);
      if (sort === "rating_asc")
        return (a.vote_average ?? 0) - (b.vote_average ?? 0);
      if (sort === "title_asc")
        return (a.title || a.name || "").localeCompare(b.title || b.name || "");
      if (sort === "title_desc")
        return (b.title || b.name || "").localeCompare(a.title || a.name || "");
      if (sort === "release_desc")
        return (
          (Date.parse(b.release_date || "0") || 0) -
          (Date.parse(a.release_date || "0") || 0)
        );
      if (sort === "release_asc")
        return (
          (Date.parse(a.release_date || "0") || 0) -
          (Date.parse(b.release_date || "0") || 0)
        );
      return 0;
    });

  return (
    <>
      <div className={styles.searchContainer}>
        <h2>Search media by title</h2>
        <i></i>
        <input
          type="text"
          id="search"
          placeholder="Search for media..."
          value={searchQuery}
          onChange={handleSearchChange}
        />

        <SearchFilters
          mediaType={mediaType}
          setMediaType={setMediaType}
          minRating={minRating}
          setMinRating={setMinRating}
          maxRating={maxRating}
          setMaxRating={setMaxRating}
          dateFrom={dateFrom}
          setDateFrom={setDateFrom}
          dateTo={dateTo}
          setDateTo={setDateTo}
          sort={sort}
          setSort={setSort}
          resetFilters={() => {
            setMediaType("all");
            setMinRating("");
            setMaxRating("");
            setDateFrom("");
            setDateTo("");
            setSort("popularity_desc");
            setSearchQuery("");
          }}
          searchTerm={searchQuery}
          setSearchTerm={setSearchQuery}
        />
      </div>

      {loading ? (
        <div className={styles["display-5"]}>Loading...</div>
      ) : displayedMedia.length === 0 && debouncedSearchQuery ? (
        <div className={styles["display-5"]}>No results found</div>
      ) : (
        <ErrorBoundary>
          <SearchResults media={displayedMedia} />
        </ErrorBoundary>
      )}
    </>
  );
};

export default Search;
