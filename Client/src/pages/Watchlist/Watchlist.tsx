import { useEffect, useState, type FunctionComponent, useMemo } from "react";
import { getAllMediaForUser } from "../../services/userMedia.service";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import { useAuth } from "../../hooks/useAuth";
import { errorMessage } from "../../services/feedback.service";
import "./Watchlist.css";
import WatchlistItem from "../../components/common/WatchlistItem/WatchlistItem";

const Watchlist: FunctionComponent = () => {
  type WatchlistFilters = {
    sort:
      | "date_desc"
      | "date_asc"
      | "rating_desc"
      | "rating_asc"
      | "title_asc"
      | "title_desc";
    mediaType: "all" | "movie" | "tv" | "book" | "anime" | "game";
    status:
      | "all"
      | "watching"
      | "completed"
      | "plan_to_watch"
      | "dropped"
      | "on_hold";
    minRating: number | "";
    maxRating: number | "";
    searchTerm: string;
    dateFrom: string;
    dateTo: string;
  };
  const { user } = useAuth();
  const [mediaList, setMediaList] = useState<UserMedia[]>([]);
  const [loading, setLoading] = useState(true);

  // UI state for filtering & sorting
  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [sort, setSort] = useState<WatchlistFilters["sort"]>("date_desc");

  // Additional filters
  const [mediaType, setMediaType] =
    useState<WatchlistFilters["mediaType"]>("all");
  const [statusFilter, setStatusFilter] =
    useState<WatchlistFilters["status"]>("all");
  const [minRating, setMinRating] = useState<WatchlistFilters["minRating"]>("");
  const [maxRating, setMaxRating] = useState<WatchlistFilters["maxRating"]>("");
  const [searchTerm, setSearchTerm] =
    useState<WatchlistFilters["searchTerm"]>("");
  const [dateFrom, setDateFrom] = useState<WatchlistFilters["dateFrom"]>("");
  const [dateTo, setDateTo] = useState<WatchlistFilters["dateTo"]>("");

  useEffect(() => {
    if (!user) {
      setMediaList([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getAllMediaForUser()
      .then((res) => setMediaList(res.data))
      .catch((err) => {
        errorMessage("Failed to load your watchlist.");
        console.error(err);
        setMediaList([]);
      })
      .finally(() => setLoading(false));
  }, [user]);

  // Derived, memoized list according to filter & sort
  const displayedList = useMemo(() => {
    let list = mediaList.slice();

    // basic filters
    if (filter === "favorites") {
      list = list.filter((m) => Boolean(m.is_favorite));
    }

    if (mediaType !== "all") {
      list = list.filter((m) => m.media_type === mediaType);
    }

    if (statusFilter !== "all") {
      list = list.filter((m) => m.status === statusFilter);
    }

    // rating range
    if (minRating !== "") {
      list = list.filter((m) =>
        typeof m.rating === "number" ? m.rating >= minRating : false
      );
    }
    if (maxRating !== "") {
      list = list.filter((m) =>
        typeof m.rating === "number" ? m.rating <= maxRating : false
      );
    }

    // date range (uses created_at)
    if (dateFrom) {
      const df = Date.parse(dateFrom);
      list = list.filter((m) =>
        m.created_at ? Date.parse(String(m.created_at)) >= df : false
      );
    }
    if (dateTo) {
      const dt = Date.parse(dateTo);
      list = list.filter((m) =>
        m.created_at ? Date.parse(String(m.created_at)) <= dt : false
      );
    }

    // search by title / overview / media_id
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      list = list.filter((m) => {
        return (
          (m.media_title && m.media_title.toLowerCase().includes(q)) ||
          (m.overview && m.overview.toLowerCase().includes(q)) ||
          (m.media_id && m.media_id.toString().includes(q))
        );
      });
    }

    // sorting
    list.sort((a, b) => {
      if (sort === "date_desc" || sort === "date_asc") {
        const ta = a.created_at ? Date.parse(String(a.created_at)) : 0;
        const tb = b.created_at ? Date.parse(String(b.created_at)) : 0;
        return sort === "date_desc" ? tb - ta : ta - tb;
      }
      if (sort === "rating_desc" || sort === "rating_asc") {
        const ra = typeof a.rating === "number" ? a.rating : -Infinity;
        const rb = typeof b.rating === "number" ? b.rating : -Infinity;
        return sort === "rating_desc" ? rb - ra : ra - rb;
      }
      if (sort === "title_asc" || sort === "title_desc") {
        const ta = (a.media_title || "").toLowerCase();
        const tb = (b.media_title || "").toLowerCase();
        return sort === "title_asc"
          ? ta < tb
            ? -1
            : ta > tb
            ? 1
            : 0
          : ta > tb
          ? -1
          : ta < tb
          ? 1
          : 0;
      }
      return 0;
    });

    return list;
  }, [
    mediaList,
    filter,
    mediaType,
    statusFilter,
    minRating,
    maxRating,
    searchTerm,
    dateFrom,
    dateTo,
    sort,
  ]);

  if (!user) {
    return (
      <div className="watchlist-message">
        Please log in to view your watchlist.
      </div>
    );
  }

  if (loading) {
    return <div className="watchlist-message">Loading...</div>;
  }

  if (mediaList.length === 0) {
    return <div className="watchlist-message">Your watchlist is empty.</div>;
  }

  return (
    <div className="watchlist-container">
      <h1 className="watchlist-title">My Watchlist</h1>

      <div className="watchlist-controls">
        <div className="watchlist-filter-group">
          <label htmlFor="filter">Quick:</label>
          <select
            id="filter"
            value={filter}
            onChange={(e) =>
              setFilter(e.target.value === "favorites" ? "favorites" : "all")
            }>
            <option value="all">All</option>
            <option value="favorites">Favorites</option>
          </select>

          <label htmlFor="mediaType">Type:</label>
          <select
            id="mediaType"
            value={mediaType}
            onChange={(e) =>
              setMediaType(e.target.value as WatchlistFilters["mediaType"])
            }>
            <option value="all">All</option>
            <option value="movie">Movie</option>
            <option value="tv">TV</option>
            <option value="book">Book</option>
            <option value="anime">Anime</option>
            <option value="game">Game</option>
          </select>

          <label htmlFor="statusFilter">Status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value as WatchlistFilters["status"])
            }>
            <option value="all">All</option>
            <option value="watching">Watching</option>
            <option value="completed">Completed</option>
            <option value="plan_to_watch">Plan to Watch</option>
            <option value="dropped">Dropped</option>
            <option value="on_hold">On Hold</option>
          </select>
        </div>

        <div className="watchlist-filter-group">
          <label htmlFor="minRating">Rating ≥</label>
          <input
            id="minRating"
            type="number"
            min={0}
            max={10}
            value={minRating as WatchlistFilters["minRating"]}
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
            value={maxRating as WatchlistFilters["maxRating"]}
            onChange={(e) =>
              setMaxRating(e.target.value === "" ? "" : Number(e.target.value))
            }
          />

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

        <div className="watchlist-filter-group">
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
            onChange={(e) =>
              setSort(e.target.value as WatchlistFilters["sort"])
            }>
            <option value="date_desc">Recently added</option>
            <option value="date_asc">Oldest added</option>
            <option value="rating_desc">Highest rating</option>
            <option value="rating_asc">Lowest rating</option>
            <option value="title_asc">Title A→Z</option>
            <option value="title_desc">Title Z→A</option>
          </select>

          <button
            onClick={() => {
              setFilter("all");
              setMediaType("all");
              setStatusFilter("all");
              setMinRating("");
              setMaxRating("");
              setSearchTerm("");
              setDateFrom("");
              setDateTo("");
              setSort("date_desc");
            }}
            type="button"
            className="watchlist-reset">
            Reset
          </button>
        </div>

        <div className="watchlist-count">
          Showing {displayedList.length} of {mediaList.length}
        </div>
      </div>

      <div className="watchlist-list">
        {displayedList.map((media) => (
          <WatchlistItem key={media._id ?? media.media_id} media={media} />
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
