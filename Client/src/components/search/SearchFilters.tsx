import type { Dispatch, SetStateAction } from "react";
import styles from "./SearchFilters.module.css";

type MediaType = "all" | "movie" | "tv" | "book" | "anime" | "game";
type sort =
  | "popularity_desc"
  | "popularity_asc"
  | "rating_desc"
  | "rating_asc"
  | "title_asc"
  | "title_desc"
  | "release_desc"
  | "release_asc";

type Props = {
  mediaType: MediaType;
  setMediaType: Dispatch<SetStateAction<MediaType>>;
  minRating: number | "";
  setMinRating: Dispatch<SetStateAction<number | "">>;
  maxRating: number | "";
  setMaxRating: Dispatch<SetStateAction<number | "">>;
  dateFrom: string;
  setDateFrom: Dispatch<SetStateAction<string>>;
  dateTo: string;
  setDateTo: Dispatch<SetStateAction<string>>;
  sort: string;
  setSort: Dispatch<SetStateAction<sort>>;
  resetFilters: () => void;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export default function SearchFilters({
  mediaType,
  setMediaType,
  minRating,
  setMinRating,
  maxRating,
  setMaxRating,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  sort,
  setSort,
  resetFilters,
  searchTerm,
  setSearchTerm,
  showMediaType = true,
}: Props & { showMediaType?: boolean }) {
  return (
    <div className={styles.container}>
      <div className={styles.group}>
        {showMediaType ? (
          <>
            <label htmlFor="mediaType">Type:</label>
            <select
              id="mediaType"
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as MediaType)}>
              <option value="all">All</option>
              <option value="movie">Movie</option>
              <option value="tv">TV</option>
              <option value="book">Book</option>
              <option value="anime">Anime</option>
              <option value="game">Game</option>
            </select>
          </>
        ) : null}

        <label htmlFor="minRating">Rating ≥</label>
        <input
          id="minRating"
          type="number"
          min={0}
          max={10}
          value={minRating}
          onChange={(e) =>
            setMinRating(e.target.value === "" ? "" : Number(e.target.value))
          }
        />

        <label htmlFor="maxRating">Rating ≤</label>
        <input
          id="maxRating"
          type="number"
          min={0}
          max={10}
          value={maxRating}
          onChange={(e) =>
            setMaxRating(e.target.value === "" ? "" : Number(e.target.value))
          }
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="dateFrom">From</label>
        <input
          id="dateFrom"
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
        />
        <label htmlFor="dateTo">To</label>
        <input
          id="dateTo"
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
        />
      </div>

      <div className={styles.group}>
        <label htmlFor="search">Search</label>
        <input
          id="search"
          type="search"
          placeholder="title, overview, tmdb id..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <label htmlFor="sort">Sort by</label>
        <select
          id="sort"
          value={sort}
          onChange={(e) => setSort(e.target.value as sort)}>
          <option value="popularity_desc">Most popular</option>
          <option value="popularity_asc">Least popular</option>
          <option value="rating_desc">Highest rating</option>
          <option value="rating_asc">Lowest rating</option>
          <option value="title_asc">Title A→Z</option>
          <option value="title_desc">Title Z→A</option>
          <option value="release_desc">Newest</option>
          <option value="release_asc">Oldest</option>
        </select>

        <button type="button" className={styles.reset} onClick={resetFilters}>
          Reset
        </button>
      </div>
    </div>
  );
}
