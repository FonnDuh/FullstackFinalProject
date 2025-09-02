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

const MediaDetails: FunctionComponent = () => {
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [media, setMedia] = useState<TmdbMovieDetails>();
  const [modalOpen, setModalOpen] = useState(false);
  const [isInList, setIsInList] = useState(false);
  const [existingMedia, setExistingMedia] = useState<UserMedia | null>(null);

  useEffect(() => {
    if (!id) return;

    let isCancelled = false;
    const fetchData = async () => {
      try {
        const res = await getMediaDetails("movie", Number(id));
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
  }, [id]);

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
        const createRes = await createMedia({
          user_id: user._id ?? "",
          media_id: media.id.toString(),
          media_type: "movie",
          media_title: media.title,
          overview: media.overview,
          cover_url: media.poster_path ?? undefined,
          progress_units: "minutes",
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

  const genres = media.genres.map((g) => g.name).join(", ");
  const countries = media.production_countries.map((c) => c.name).join(", ");

  return (
    <div className="movieDetails">
      <div className="movieHeader">
        <img
          className="poster"
          src={`https://image.tmdb.org/t/p/w500${media.poster_path}`}
          alt={media.title}
        />
        <div className="movieBasic">
          <h1 className="title">{media.title}</h1>
          {media.tagline && <p className="tagline">{media.tagline}</p>}
          <p className="meta">
            <span>{media.release_date.slice(0, 4)}</span> •{" "}
            <span>{media.runtime} min</span> • <span>{genres}</span>
          </p>
          <p className="rating">
            ⭐ {media.vote_average.toFixed(1)} / 10 ({media.vote_count} votes)
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
              className="media-action-btn list-btn">
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
            <strong>Status:</strong> {media.status}
          </li>
          <li>
            <strong>Release Date:</strong> {media.release_date}
          </li>
          <li>
            <strong>Original Language:</strong>{" "}
            {media.original_language.toUpperCase()}
          </li>
          <li>
            <strong>Country:</strong> {countries || "N/A"}
          </li>
          <li>
            <strong>Budget:</strong>{" "}
            {media.budget.toLocaleString() == "$0"
              ? media.budget.toLocaleString()
              : " - "}
          </li>
          <li>
            <strong>Revenue:</strong>{" "}
            {media.revenue.toLocaleString() == "$0"
              ? media.revenue.toLocaleString()
              : " - "}
          </li>
          {media.imdb_id && (
            <li>
              <strong>IMDB ID:</strong> {media.imdb_id}
            </li>
          )}
        </ul>
      </div>

      <div className="production">
        <h2>Production Companies</h2>
        <ul>
          {media.production_companies.map((c) => (
            <li key={c.id}>
              {c.name} ({c.origin_country})
            </li>
          ))}
        </ul>
      </div>

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
            className="media-action-btn list-btn"
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
