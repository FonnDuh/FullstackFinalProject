import { useEffect, useState, type FunctionComponent } from "react";
import { errorMessage, successMessage } from "../../services/feedback.service";
import { useParams } from "react-router-dom";
import type { TmdbMovieDetails } from "../../interfaces/Media/TmdbMovieDetails";
import "./MovieDetails.css";
import { getMediaDetails } from "../../services/tmdb/tmdb.service";
import { createMedia } from "../../services/userMedia.service";
import {
  getAllMediaForUser,
  updateMediaForUser,
  deleteMediaForUser,
} from "../../services/userMedia.service";
import { useAuth } from "../../hooks/useAuth";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import { Modal } from "../../components/common/Modal/Modal";
import MediaTracking from "../../components/common/MediaTracking";
import type { TmdbTvDetails } from "../../interfaces/Media/TmdbTvDetails";

const MediaDetails: FunctionComponent = () => {
  const { user } = useAuth();
  const { type, id } = useParams<{ type?: string; id?: string }>();
  const [media, setMedia] = useState<TmdbMovieDetails | TmdbTvDetails>();
  const [modalOpen, setModalOpen] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [existingMedia, setExistingMedia] = useState<UserMedia | null>(null);

  useEffect(() => {
    if (!id) return;

    const tmdbType = type === "tv" ? "tv" : "movie";

    let isCancelled = false;
    const fetchData = async () => {
      try {
        const res = await getMediaDetails(tmdbType, Number(id));
        if (!isCancelled) setMedia(res.data);
      } catch (error) {
        console.error("Error fetching media data:", error);
        errorMessage("Failed to load media details.");
      }
    };

    fetchData();

    return () => {
      isCancelled = true; // Prevents setState on unmounted component
    };
  }, [id, type]);

  useEffect(() => {
    if (!user || !media) return;
    let cancelled = false;
    const checkSaved = async () => {
      try {
        const res = await getAllMediaForUser();
        if (!cancelled && res && res.data) {
          const found = res.data.find(
            (m: UserMedia) => m.media_id === media.id.toString()
          );
          if (found) {
            setExistingMedia(found as UserMedia);
            setIsInList(true);
          } else {
            setExistingMedia(null);
            setIsInList(false);
          }
        }
      } catch {
        setExistingMedia(null);
        setIsInList(false);
      }
    };

    checkSaved();

    return () => {
      cancelled = true;
    };
  }, [user, media]);

  const handleAddToFavorites = async () => {
    if (!media || !user) return;
    try {
      if (!existingMedia || !existingMedia._id) {
        errorMessage("Add this item to your list first to mark as favorite.");
        return;
      }

      const payload = { is_favorite: !existingMedia.is_favorite };
      const updated = await updateMediaForUser(existingMedia._id, payload);

      if (updated && updated.data) {
        setExistingMedia(updated.data as UserMedia);
      } else {
        setExistingMedia((prev) =>
          prev
            ? ({ ...prev, is_favorite: !prev.is_favorite } as UserMedia)
            : prev
        );
      }

      successMessage(
        !existingMedia.is_favorite ? "Marked as favorite!" : "Removed favorite."
      );
    } catch (error) {
      console.error("Error updating favorite status:", error);
      errorMessage("Failed to update favorite status.");
    }
  };

  const handleAddToMyList = async () => {
    if (!media || !user) return;
    try {
      const res = await getAllMediaForUser();
      const existing = res.data.find(
        (m: UserMedia) => m.media_id === media.id.toString()
      );
      if (existing) {
        errorMessage("Already in your list.");
        setExistingMedia(existing);
        setIsInList(true);
      } else {
        const tmdbType = type === "tv" ? "tv" : "movie";
        const mediaTitle =
          (tmdbType === "tv"
            ? (media as TmdbTvDetails).name
            : (media as TmdbMovieDetails).title) ?? "";
        const progressUnits = tmdbType === "tv" ? "episodes" : "minutes";

        const createRes = await createMedia({
          user_id: user._id ?? "",
          media_id: media.id.toString(),
          media_type: tmdbType,
          media_title: mediaTitle,
          overview:
            (isTv
              ? (media as TmdbTvDetails).overview
              : (media as TmdbMovieDetails).overview) ?? undefined,
          cover_url:
            (isTv
              ? (media as TmdbTvDetails).poster_path
              : (media as TmdbMovieDetails).poster_path) ?? undefined,
          progress_units: progressUnits,
        });
        successMessage("Added to your list!");
        if (createRes && createRes.data) {
          setExistingMedia(createRes.data as UserMedia);
        }
        setIsInList(true);
      }
    } catch (error) {
      console.error("Error adding media to list:", error);
      errorMessage("Failed to add media to list.");
    }
  };

  const handleConfirmDelete = async () => {
    if (!user || !media) return;
    try {
      if (existingMedia && existingMedia._id) {
        await deleteMediaForUser(existingMedia._id);
      } else {
        const res = await getAllMediaForUser();
        const found = res.data.find(
          (m: UserMedia) => m.media_id === media.id.toString()
        );
        if (found && found._id) await deleteMediaForUser(found._id);
      }
      successMessage("Removed from your list.");
      setIsInList(false);
      setExistingMedia(null);
      setModalOpen(false);
    } catch (error) {
      console.error("Error removing media from list:", error);
      errorMessage("Failed to remove media from your list.");
    }
  };

  if (!media) return <div>No Media Found</div>;

  const tmdbType = type === "tv" ? "tv" : "movie";
  const isTv = tmdbType === "tv";

  let title = "";
  let posterPath = "";
  let genres = "";
  let countries = "";
  let releaseDate = "";
  let runtime: number | null = null;
  let voteAverage = 0;
  let voteCount = 0;
  let tagline = "";
  let statusText = "";
  let originalLanguage = "";
  let prodCompanies: Array<{
    id?: number;
    name?: string;
    origin_country?: string;
  }> = [];

  if (isTv) {
    const tv = media as TmdbTvDetails;
    title = tv.name ?? "";
    posterPath = tv.poster_path ?? tv.backdrop_path ?? "";
    genres = (tv.genres ?? []).map((g) => g.name).join(", ");
    const tvCountries: Array<{ iso_3166_1?: string; name?: string } | string> =
      tv.production_countries ?? tv.origin_country ?? [];
    countries = tvCountries
      .map((c) => (typeof c === "string" ? c : c.name ?? ""))
      .filter(Boolean)
      .join(", ");
    releaseDate = tv.first_air_date ?? tv.last_air_date ?? "";
    runtime =
      tv.episode_run_time && tv.episode_run_time.length > 0
        ? tv.episode_run_time[0]
        : tv.last_episode_to_air?.runtime ?? null;
    voteAverage = tv.vote_average ?? 0;
    voteCount = tv.vote_count ?? 0;
    tagline = tv.tagline ?? "";
    statusText = tv.status ?? "";
    originalLanguage = tv.original_language ?? "";
    prodCompanies = tv.production_companies ?? [];
  } else {
    const mv = media as TmdbMovieDetails;
    title = mv.title ?? "";
    posterPath = mv.poster_path ?? mv.backdrop_path ?? "";
    genres = (mv.genres ?? []).map((g) => g.name).join(", ");
    countries = (mv.production_countries ?? []).map((c) => c.name).join(", ");
    releaseDate = mv.release_date ?? "";
    runtime = mv.runtime ?? null;
    voteAverage = mv.vote_average ?? 0;
    voteCount = mv.vote_count ?? 0;
    tagline = mv.tagline ?? "";
    statusText = mv.status ?? "";
    originalLanguage = mv.original_language ?? "";
    prodCompanies = mv.production_companies ?? [];
  }

  return (
    <div className="movieDetails">
      <div className="movieHeader">
        <img
          className="poster"
          src={`https://image.tmdb.org/t/p/w500${posterPath}`}
          alt={title}
        />
        <div className="movieBasic">
          <h1 className="title">{title}</h1>
          {tagline && <p className="tagline">{tagline}</p>}
          <p className="meta">
            {releaseDate ? <span>{releaseDate.slice(0, 4)}</span> : null} •{" "}
            {runtime ? <span>{runtime} min</span> : null} •{" "}
            <span>{genres}</span>
          </p>
          <p className="rating">
            ⭐ {voteAverage.toFixed(1)} / 10 ({voteCount} votes)
          </p>
        </div>
        {user ? (
          <div className="media-actions">
            {isInList && (
              <button
                onClick={handleAddToFavorites}
                className="media-action-btn favorite-btn">
                {existingMedia && existingMedia.is_favorite
                  ? "💛 Favorited"
                  : "❤️ Add to Favorites"}
              </button>
            )}
            <button
              onClick={async () => {
                if (isInList) {
                  // temporarily clear the 'Added' state while confirming
                  setIsInList(false);
                  setModalOpen(true);
                } else {
                  await handleAddToMyList();
                }
              }}
              className="media-action-btn">
              {isInList ? "✓ Added to list" : "➕ Add to My List"}
            </button>
          </div>
        ) : (
          <p>Please log in to add this media to your favorites or watchlist.</p>
        )}
      </div>

      <div className="overview">
        <h2>Overview</h2>
        <p>{media.overview || "No overview available."}</p>
      </div>

      <div className="keyFacts">
        <h2>Key Facts</h2>
        <ul>
          <li>
            <strong>Status:</strong> {statusText}
          </li>
          {releaseDate && (
            <li>
              <strong>Release Date:</strong> {releaseDate}
            </li>
          )}
          <li>
            <strong>Original Language:</strong>{" "}
            {originalLanguage ? originalLanguage.toUpperCase() : "N/A"}
          </li>
          <li>
            <strong>Country:</strong> {countries || "N/A"}
          </li>

          {!isTv && (
            <>
              <li>
                <strong>Budget:</strong>{" "}
                {((media as TmdbMovieDetails).budget ?? 0) === 0
                  ? ((media as TmdbMovieDetails).budget ?? 0).toLocaleString()
                  : " - "}
              </li>
              <li>
                <strong>Revenue:</strong>{" "}
                {((media as TmdbMovieDetails).revenue ?? 0) === 0
                  ? ((media as TmdbMovieDetails).revenue ?? 0).toLocaleString()
                  : " - "}
              </li>
              {(media as TmdbMovieDetails).imdb_id && (
                <li>
                  <strong>IMDB ID:</strong>{" "}
                  {(media as TmdbMovieDetails).imdb_id}
                </li>
              )}
            </>
          )}
        </ul>
      </div>

      <div className="production">
        <h2>Production Companies</h2>
        <ul>
          {prodCompanies.map((c) => (
            <li key={c.id}>
              {c.name} ({c.origin_country})
            </li>
          ))}
        </ul>
      </div>
      {user && existingMedia && (
        <MediaTracking
          mediaId={(media as TmdbMovieDetails | TmdbTvDetails).id.toString()}
          mediaType={tmdbType as "movie" | "tv"}
          existingMedia={existingMedia}
        />
      )}

      <Modal
        open={modalOpen}
        onOpenChange={(open) => {
          setModalOpen(open);
          if (!open && existingMedia) setIsInList(true);
        }}
        title="Remove from your watchlist"
        description="Are you sure you want to remove this item from your watchlist?">
        <p>This action will remove the item from your personal watchlist.</p>
        <div className="modal-actions" style={{ marginTop: 12 }}>
          <button
            className="media-action-btn"
            onClick={() => {
              setModalOpen(false);
              if (existingMedia) setIsInList(true);
            }}>
            Cancel
          </button>
          <button
            className="media-action-btn"
            onClick={handleConfirmDelete}
            style={{ marginLeft: 8 }}>
            Remove
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default MediaDetails;
