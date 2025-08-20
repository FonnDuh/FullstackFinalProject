import { useEffect, useMemo, useState } from "react";
import {
  createMedia,
  getMediaByBothId,
  updateMediaForUser,
} from "../../services/userMedia.service";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import type { Media } from "../../interfaces/Media/Media.interface";
interface Props {
  userId: string;
  media: Media;
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
  const [saving, setSaving] = useState<null | "favorite" | "watchlist">(null);

  const tmdbId = useMemo(() => String(media.id ?? ""), [media.id]); // external id
  const userMediaId = userMedia?._id ?? null; // internal id (only after fetch/create)

  useEffect(() => {
    if (!userId || !media?._id) return;

    let mounted = true;
    setLoading(true);

    getMediaByBothId(userId, media._id) // internal MongoDB id here
      .then((res) => {
        if (!mounted) return;
        setUserMedia(res?.data ?? null);
      })
      .catch((err) => {
        if (err?.response?.status !== 404)
          console.error("Fetch userMedia failed:", err);
        if (mounted) setUserMedia(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [userId, media?._id]); // depends on Mongo id now

  function baseUserMedia(partial?: Partial<UserMedia>): UserMedia {
    return {
      user_id: userId,
      media_id: tmdbId, // always TMDB here
      media_type: media.type ?? "unknown",
      media_title:
        media.title || media.name || media.original_name || "Untitled",
      overview: media.overview,
      cover_url: media.poster_path || media.backdrop_path || undefined,
      ...partial,
    };
  }

  async function upsert(partial: Partial<UserMedia>) {
    if (userMediaId) {
      const body = { ...(userMedia as UserMedia), ...partial };
      const res = await updateMediaForUser(userMediaId, body);
      return res?.data as UserMedia;
    } else {
      const payload = baseUserMedia(partial);
      const res = await createMedia(payload);
      return res?.data as UserMedia;
    }
  }

  async function toggleFavorite() {
    if (saving) return; // prevent overlap
    const next = !(userMedia?.is_favorite ?? false);

    // optimistic
    setSaving("favorite");
    setUserMedia((u) =>
      u ? { ...u, is_favorite: next } : baseUserMedia({ is_favorite: next })
    );

    try {
      const saved = await upsert({ is_favorite: next });
      setUserMedia(saved ?? null);
      onChange?.(saved ?? null);
    } catch (e) {
      console.error("Toggle favorite failed:", e);
      setUserMedia((u) => (u ? { ...u, is_favorite: !next } : u)); // rollback
    } finally {
      setSaving(null);
    }
  }

  async function toggleWatchlist() {
    if (saving) return;
    const was = userMedia?.status;
    const isInWatchlist = was === "plan_to_watch";
    // Use null (not undefined). Many APIs ignore `undefined` in PATCH merges.
    const next: UserMedia["status"] = isInWatchlist ? null : "plan_to_watch";

    setSaving("watchlist");
    setUserMedia((u) =>
      u ? { ...u, status: next } : baseUserMedia({ status: next })
    );

    try {
      const saved = await upsert({ status: next });
      setUserMedia(saved ?? null);
      onChange?.(saved ?? null);
    } catch (e) {
      console.error("Toggle watchlist failed:", e);
      setUserMedia((u) => (u ? { ...u, status: was } : u)); // rollback
    } finally {
      setSaving(null);
    }
  }

  const favoriteActive = Boolean(userMedia?.is_favorite);
  const watchlistActive = userMedia?.status === "plan_to_watch";

  return (
    <div className={`quickActions ${className ?? ""}`}>
      <button
        className={`quickButton favorite ${favoriteActive ? "active" : ""}`}
        title={favoriteActive ? "Remove from favorites" : "Add to favorites"}
        aria-pressed={favoriteActive}
        onClick={toggleFavorite}
        disabled={loading || saving === "favorite"}>
        {favoriteActive ? "❤️" : "🤍"}
      </button>

      <button
        className={`quickButton watchlist ${watchlistActive ? "active" : ""}`}
        title={watchlistActive ? "Remove from watchlist" : "Add to watchlist"}
        aria-pressed={watchlistActive}
        onClick={toggleWatchlist}
        disabled={loading || saving === "watchlist"}>
        {watchlistActive ? "📌" : "📎"}
      </button>
    </div>
  );
}
