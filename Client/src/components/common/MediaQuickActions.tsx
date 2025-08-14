import { useEffect, useState } from "react";
import type { Media } from "../../interfaces/Media/Media.interface";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import {
  createMedia,
  getMediaByBothId,
  updateMediaForUser,
} from "../../services/userMedia.service";
import type { MediaStatus } from "../../interfaces/common/MediaSubtypes.interface";

interface Props {
  userId: string;
  media: Media; // now we receive full Media object
  className?: string;
  onChange?: (updated?: UserMedia | null) => void;
}

export default function MediaQuickActions({
  userId,
  media,
  className,
  onChange,
}: Props) {
  const [userMedia, setUserMedia] = useState<UserMedia | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingFavorite, setSavingFavorite] = useState(false);
  const [savingWatchlist, setSavingWatchlist] = useState(false);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getMediaByBothId(userId, String(media.id))
      .then((res) => {
        if (!mounted) return;
        setUserMedia(res?.data ?? null);
      })
      .catch((err) => {
        if (err?.response?.status && err.response.status !== 404) {
          console.error("Failed to fetch user media:", err);
        }
        setUserMedia(null);
      })
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, [userId, media.id]);

  function mapMediaToUserMedia(partial?: Partial<UserMedia>): UserMedia {
    return {
      user_id: userId,
      media_id: String(media.id ?? ""),
      media_type: media.type ?? "unknown",
      media_title:
        media.title || media.name || media.original_name || "Untitled",
      overview: media.overview,
      cover_url: media.poster_path || media.backdrop_path || undefined,
      ...partial,
    };
  }

  async function upsertUserMedia(partial: Partial<UserMedia>) {
    if (userMedia && userMedia._id) {
      const updatedBody: UserMedia = { ...userMedia, ...partial } as UserMedia;
      const res = await updateMediaForUser(userMedia._id, updatedBody);
      return res?.data;
    } else {
      const payload = mapMediaToUserMedia(partial);
      const res = await createMedia(payload);
      return res?.data;
    }
  }

  const toggleFavorite = async () => {
    const prev = userMedia?.is_favorite ?? false;
    const next = !prev;
    setUserMedia((u) =>
      u
        ? { ...u, is_favorite: next }
        : mapMediaToUserMedia({ is_favorite: next })
    );
    setSavingFavorite(true);
    try {
      const saved = await upsertUserMedia({ is_favorite: next });
      setUserMedia(saved ?? null);
      onChange?.(saved ?? null);
    } catch (err) {
      setUserMedia((u) => (u ? { ...u, is_favorite: prev } : u));
      console.error("Failed to toggle favorite:", err);
    } finally {
      setSavingFavorite(false);
    }
  };

  const toggleWatchlist = async () => {
    const prevStatus = userMedia?.status;
    const isInWatchlist = prevStatus === "plan_to_watch";
    const nextStatus: MediaStatus | undefined = isInWatchlist
      ? undefined
      : "plan_to_watch";

    setUserMedia((u) =>
      u
        ? { ...u, status: nextStatus }
        : mapMediaToUserMedia({ status: nextStatus })
    );

    setSavingWatchlist(true);
    try {
      const saved = await upsertUserMedia({ status: nextStatus });
      setUserMedia(saved ?? null);
      onChange?.(saved ?? null);
    } catch (err) {
      setUserMedia((u) => (u ? { ...u, status: prevStatus } : u));
      console.error("Failed to toggle watchlist:", err);
    } finally {
      setSavingWatchlist(false);
    }
  };

  const favoriteActive = Boolean(userMedia?.is_favorite);
  const watchlistActive = userMedia?.status === "plan_to_watch";

  return (
    <div className={`quickActions ${className ?? ""}`}>
      <button
        className={`quickButton favorite ${favoriteActive ? "active" : ""}`}
        title={favoriteActive ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favoriteActive}
        onClick={toggleFavorite}
        disabled={loading || savingFavorite}>
        {favoriteActive ? "❤️" : "🤍"}
      </button>

      <button
        className={`quickButton watchlist ${watchlistActive ? "active" : ""}`}
        title={watchlistActive ? "Remove from watchlist" : "Add to watchlist"}
        aria-pressed={watchlistActive}
        onClick={toggleWatchlist}
        disabled={loading || savingWatchlist}>
        {watchlistActive ? "📌" : "📎"}
      </button>
    </div>
  );
}
