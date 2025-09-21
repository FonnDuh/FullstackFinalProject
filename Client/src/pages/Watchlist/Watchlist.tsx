import { useEffect, useState, type FunctionComponent, useMemo } from "react";
import { getAllMediaForUser } from "../../services/userMedia.service";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import { useAuth } from "../../hooks/useAuth";
import { errorMessage } from "../../services/feedback.service";
import "./Watchlist.css";
import WatchlistItem from "../../components/common/WatchlistItem/WatchlistItem";
import SearchFilters from "../../components/search/SearchFilters";

const Watchlist: FunctionComponent = () => {
  type WatchlistFilters = {
    sort:
      | "popularity_desc"
      | "popularity_asc"
      | "rating_desc"
      | "rating_asc"
      | "title_asc"
      | "title_desc"
      | "release_desc"
      | "release_asc";
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

  const [filter, setFilter] = useState<"all" | "favorites">("all");
  const [sort, setSort] = useState<WatchlistFilters["sort"]>("release_desc");

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

  const displayedList = useMemo(() => {
    let list = mediaList.slice();

    if (filter === "favorites") {
      list = list.filter((m) => Boolean(m.is_favorite));
    }

    if (mediaType !== "all") {
      list = list.filter((m) => m.media_type === mediaType);
    }

    if (statusFilter !== "all") {
      list = list.filter((m) => m.status === statusFilter);
    }

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

    list.sort((a, b) => {
      if (sort === "release_desc" || sort === "release_asc") {
        const ta = a.created_at ? Date.parse(String(a.created_at)) : 0;
        const tb = b.created_at ? Date.parse(String(b.created_at)) : 0;
        return sort === "release_desc" ? tb - ta : ta - tb;
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
            setFilter("all");
            setMediaType("all");
            setStatusFilter("all");
            setMinRating("");
            setMaxRating("");
            setSearchTerm("");
            setDateFrom("");
            setDateTo("");
            setSort("release_desc");
          }}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

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
