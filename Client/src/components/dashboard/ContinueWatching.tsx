import { type FunctionComponent, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import {
  getAllMediaForUser,
  updateMediaForUser,
} from "../../services/userMedia.service";
import { getMediaDetails } from "../../services/tmdb/tmdb.service";
import { toast } from "react-toastify";

const ContinueWatching: FunctionComponent = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [marking, setMarking] = useState<boolean>(false);
  const [current, setCurrent] = useState<UserMedia | null>(null);
  const [seasonEpisodes, setSeasonEpisodes] = useState<number | undefined>(
    undefined
  );
  const [totalSeasons, setTotalSeasons] = useState<number | undefined>(
    undefined
  );
  const [userMediaList, setUserMediaList] = useState<UserMedia[]>([]);
  const [undoAvailable, setUndoAvailable] = useState<boolean>(false);
  const [previousState, setPreviousState] = useState<Partial<UserMedia> | null>(
    null
  );
  const [undoTimer, setUndoTimer] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAllMediaForUser()
      .then((res) => {
        if (!mounted) return;
        const list: UserMedia[] = res.data ?? [];
        setUserMediaList(list);

        const tvInProgress = list
          .filter(
            (m) =>
              m.media_type === "tv" &&
              (m.status === "watching" || m.tv_tracking)
          )
          .sort((a, b) => {
            const ta = a.updated_at ? new Date(a.updated_at).getTime() : 0;
            const tb = b.updated_at ? new Date(b.updated_at).getTime() : 0;
            return tb - ta;
          });

        if (tvInProgress.length > 0) {
          setCurrent(tvInProgress[0]);
        } else {
          setCurrent(null);
        }
      })
      .catch((err) => {
        console.error("Failed to load user media for continue watching", err);
        toast.error("Could not load your progress");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    setSeasonEpisodes(undefined);
    if (!current || current.media_type !== "tv") return;

    const id = current.media_id;
    if (!id) return;

    getMediaDetails("tv", id as unknown as number)
      .then((res) => {
        if (!mounted) return;
        const data = res.data as Record<string, unknown>;
        const seasonNum = current.tv_tracking?.current_season ?? 1;
        const seasons = Array.isArray(data.seasons)
          ? (data.seasons as unknown[])
          : undefined;
        const season = seasons
          ? (seasons.find((s) => {
              const sRec = s as Record<string, unknown>;
              return sRec["season_number"] === seasonNum;
            }) as Record<string, unknown> | undefined)
          : undefined;
        if (season && typeof season["episode_count"] === "number") {
          setSeasonEpisodes(season["episode_count"] as number);
        } else if (typeof data["number_of_episodes"] === "number") {
          setSeasonEpisodes(data["number_of_episodes"] as number);
        }
        if (seasons && seasons.length > 0) {
          const reduced = seasons.reduce((acc: number, s) => {
            const sRec = s as Record<string, unknown>;
            const sn =
              typeof sRec["season_number"] === "number"
                ? (sRec["season_number"] as number)
                : 0;
            return Math.max(acc, sn);
          }, 0);
          if (reduced > 0) setTotalSeasons(reduced);
        }
      })
      .catch((err) => {
        console.warn("Could not load TV details for progress bar", err);
      });

    return () => {
      mounted = false;
    };
  }, [current]);

  // Small heuristics for estimating watch time when exact runtime isn't available
  const AVG_EPISODE_MIN = 45; // default minutes per TV episode
  const AVG_MOVIE_MIN = 120; // default minutes per movie

  type EpisodeHist = {
    episode_number: number;
    season_number: number;
    watched_at: string | Date;
  };

  const hoursTracked = useMemo(() => {
    if (!userMediaList || userMediaList.length === 0) return 0;
    let totalMinutes = 0;
    userMediaList.forEach((m) => {
      if (m.media_type === "tv" && m.tv_tracking?.episode_watch_history) {
        // count unique season:episode pairs
        const set = new Set<string>();
        (m.tv_tracking.episode_watch_history ?? []).forEach((h) => {
          const rec = h as EpisodeHist;
          const ep = rec.episode_number;
          const s = rec.season_number;
          if (typeof ep === "number" && typeof s === "number") {
            set.add(`${s}:${ep}`);
          }
        });
        totalMinutes += set.size * AVG_EPISODE_MIN;
      } else if (m.media_type === "movie") {
        // treat watched or completed movies as one movie watched
        if (m.status === "completed" || m.status === "watching") {
          totalMinutes += AVG_MOVIE_MIN;
        }
      }
    });
    return +(totalMinutes / 60).toFixed(1);
  }, [userMediaList]);

  const currentStreak = useMemo(() => {
    if (!userMediaList || userMediaList.length === 0) return 0;
    const dateSet = new Set<string>();

    const pushDate = (d: Date) => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      dateSet.add(`${y}-${m}-${day}`);
    };

    userMediaList.forEach((m) => {
      if (m.media_type === "tv" && m.tv_tracking?.episode_watch_history) {
        (m.tv_tracking.episode_watch_history ?? []).forEach((h) => {
          const rec = h as EpisodeHist;
          const watched = rec.watched_at;
          if (!watched) return;
          const dt =
            typeof watched === "string" ? new Date(watched) : (watched as Date);
          if (!isNaN(dt.getTime())) pushDate(dt);
        });
      } else if (m.media_type === "movie") {
        // use updated_at as a proxy for activity on movies
        if (m.updated_at) {
          const dt = new Date(m.updated_at);
          if (!isNaN(dt.getTime())) pushDate(dt);
        }
      }
    });

    // compute current consecutive streak ending today
    let streak = 0;
    const today = new Date();
    // normalize to local date
    const checkDay = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
        d.getDate()
      ).padStart(2, "0")}`;
    const cursor = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    while (true) {
      const key = checkDay(cursor);
      if (dateSet.has(key)) {
        streak += 1;
        // move one day back
        cursor.setDate(cursor.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  }, [userMediaList]);

  const seasonWatchedCount = useMemo(() => {
    if (!current || !current.tv_tracking) return 0;
    const s = current.tv_tracking.current_season ?? 1;
    const set = new Set<number>();
    (current.tv_tracking.episode_watch_history ?? []).forEach((h) => {
      const rec = h as EpisodeHist;
      if (
        rec &&
        rec.season_number === s &&
        typeof rec.episode_number === "number"
      ) {
        set.add(rec.episode_number);
      }
    });
    return set.size;
  }, [current]);

  const handleMarkEpisode = async () => {
    if (!current) return;
    setMarking(true);
    try {
      const prev = {
        tv_tracking: current.tv_tracking,
        status: current.status,
        completed_date: current.completed_date,
      } as Partial<UserMedia>;
      setPreviousState(prev);
      const tv = current.tv_tracking ?? {
        current_season: 1,
        current_episode: 0,
        episode_watch_history: [],
      };
      const season = tv.current_season ?? 1;
      let nextEpisode = (tv.current_episode ?? 0) + 1;
      let nextSeason = season;
      let willComplete = false;

      // If we don't have reliable season episode counts or total seasons, fetch details now
      if (
        typeof seasonEpisodes !== "number" ||
        typeof totalSeasons !== "number"
      ) {
        try {
          const details = await getMediaDetails(
            "tv",
            current.media_id as unknown as number
          );
          const data = details.data as Record<string, unknown>;
          const seasonsArr = Array.isArray(data.seasons)
            ? (data.seasons as unknown[])
            : undefined;
          if (seasonsArr && seasonsArr.length > 0) {
            const found = seasonsArr.find((s) => {
              const sRec = s as Record<string, unknown>;
              return sRec["season_number"] === season;
            }) as Record<string, unknown> | undefined;
            if (found && typeof found["episode_count"] === "number") {
              setSeasonEpisodes(found["episode_count"] as number);
            }
            const reduced = seasonsArr.reduce((acc: number, s) => {
              const sRec = s as Record<string, unknown>;
              const sn =
                typeof sRec["season_number"] === "number"
                  ? (sRec["season_number"] as number)
                  : 0;
              return Math.max(acc, sn);
            }, 0);
            if (reduced > 0) setTotalSeasons(reduced);
          }
        } catch (err) {
          // ignore fetch failure; we'll fallback to conservative checks
          console.warn("Could not refresh TMDB details during mark", err);
        }
      }

      // decide whether to roll seasons or mark completed
      if (typeof seasonEpisodes === "number") {
        if (nextEpisode > seasonEpisodes) {
          if (typeof totalSeasons === "number" && season < totalSeasons) {
            nextSeason = season + 1;
            nextEpisode = 1;
          } else {
            willComplete = true;
          }
        }
      } else if (typeof totalSeasons === "number" && season < totalSeasons) {
        // episode count unknown but there are more seasons -> roll to next season
        nextSeason = season + 1;
        nextEpisode = 1;
      } else {
        // unknowns: no season info available; be conservative — increment episode number
        // to avoid incorrectly marking completed, do not mark complete here
      }

      const newHistory = Array.isArray(tv.episode_watch_history)
        ? [...tv.episode_watch_history]
        : [];
      newHistory.push({
        episode_number: nextEpisode,
        season_number: nextSeason,
        watched_at: new Date(),
      });

      const updated: Partial<UserMedia> = {
        tv_tracking: {
          ...tv,
          current_season: nextSeason,
          current_episode: nextEpisode,
          episode_watch_history: newHistory,
        },
      };

      if (willComplete) {
        // mark as completed
        (updated as Partial<UserMedia>).status =
          "completed" as import("../../interfaces/common/MediaSubtypes.interface").MediaStatus;
        (updated as Partial<UserMedia>).completed_date =
          new Date().toISOString();
      }

      const sendPayload = {
        tv_tracking: {
          current_season: updated.tv_tracking?.current_season,
          current_episode: updated.tv_tracking?.current_episode,
          episode_watch_history: Array.isArray(
            updated.tv_tracking?.episode_watch_history
          )
            ? updated.tv_tracking!.episode_watch_history!.map((h) => ({
                episode_number: h.episode_number,
                season_number: h.season_number,
                watched_at:
                  h.watched_at instanceof Date
                    ? h.watched_at.toISOString()
                    : h.watched_at,
              }))
            : [],
        },
      } as unknown as Partial<UserMedia>;

      if (willComplete) {
        sendPayload.status = updated.status;
        sendPayload.completed_date = updated.completed_date;
      }

      await updateMediaForUser(current._id as string, sendPayload);

      setCurrent((prev) => {
        if (!prev) return prev;
        return { ...prev, ...updated } as UserMedia;
      });

      setUndoAvailable(true);
      if (undoTimer) window.clearTimeout(undoTimer);
      const id = window.setTimeout(() => {
        setUndoAvailable(false);
        setPreviousState(null);
        setUndoTimer(null);
      }, 6000);
      setUndoTimer(id);

      toast.success(`Marked S${season}E${nextEpisode} as watched`);
    } catch (err) {
      console.error("Failed to mark episode watched", err);
      toast.error("Could not mark episode as watched");
    } finally {
      setMarking(false);
    }
  };

  const handleUndo = async () => {
    if (!current || !previousState) return;
    if (undoTimer) {
      window.clearTimeout(undoTimer);
      setUndoTimer(null);
    }
    setUndoAvailable(false);
    setMarking(true);
    try {
      const sendPrev = { ...previousState } as Partial<UserMedia>;
      if (
        sendPrev.tv_tracking &&
        Array.isArray(sendPrev.tv_tracking.episode_watch_history)
      ) {
        sendPrev.tv_tracking.episode_watch_history =
          sendPrev.tv_tracking.episode_watch_history.map((h: unknown) => {
            const rec = h as Record<string, unknown>;
            return {
              episode_number: rec["episode_number"] as number,
              season_number: rec["season_number"] as number,
              watched_at:
                rec["watched_at"] instanceof Date
                  ? (rec["watched_at"] as Date).toISOString()
                  : (rec["watched_at"] as string),
            };
          }) as unknown as {
            episode_number: number;
            season_number: number;
            watched_at: Date;
          }[];
      }
      const serverPrev = {
        tv_tracking: sendPrev.tv_tracking,
      } as unknown as Partial<UserMedia>;
      await updateMediaForUser(current._id as string, serverPrev);
      setCurrent((prev) => {
        if (!prev) return prev;
        return { ...prev, ...previousState } as UserMedia;
      });
      toast.info("Reverted last mark");
      setPreviousState(null);
    } catch (err) {
      console.error("Failed to undo", err);
      toast.error("Could not revert change");
    } finally {
      setMarking(false);
    }
  };

  if (loading) {
    return (
      <div className="dashboard__main-left card">
        <h2>Continue Watching</h2>
        <p>Loading your progress...</p>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="dashboard__main-left card">
        <h2>No media in progress</h2>
        <p>Once you start tracking shows or movies they will appear here.</p>
        <Link className="btn-primary" to="/browse">
          Browse media
        </Link>
      </div>
    );
  }

  const season = current.tv_tracking?.current_season ?? 1;
  const episode = current.tv_tracking?.current_episode ?? 0;
  const nextEpisode = episode + 1;
  let backdrop: string | undefined;
  if (current) {
    const currRec = current as unknown as Record<string, unknown>;
    if (
      "backdrop_url" in currRec &&
      typeof currRec["backdrop_url"] === "string"
    ) {
      backdrop = currRec["backdrop_url"] as string;
    } else {
      backdrop = current.cover_url ?? undefined;
    }
  } else {
    backdrop = undefined;
  }

  return (
    <div
      className="dashboard__main-left card continue-watching"
      style={
        backdrop
          ? {
              backgroundImage: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.15)), url(https://image.tmdb.org/t/p/original${backdrop})`,
            }
          : undefined
      }>
      <h3>Continue Watching</h3>
      <div className="cw-row">
        {current.cover_url ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${current.cover_url}`}
            alt={current.media_title}
            className="cw-cover"
          />
        ) : null}
        <div className="cw-meta">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h4 style={{ margin: 0 }}>{current.media_title}</h4>
            {typeof seasonEpisodes === "number" && (
              <div style={{ width: 56, height: 56 }} aria-hidden>
                <svg viewBox="0 0 36 36" style={{ width: 56, height: 56 }}>
                  <path
                    d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.15)"
                    strokeWidth="2.8"
                  />
                  <path
                    stroke="#fff"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    fill="none"
                    strokeDasharray={`${Math.min(
                      100,
                      Math.round((seasonWatchedCount / seasonEpisodes) * 100)
                    )}, 100`}
                    d="M18 2.0845a15.9155 15.9155 0 1 0 0 31.831"
                  />
                  <text
                    x="18"
                    y="20.5"
                    fontSize="6"
                    textAnchor="middle"
                    fill="#fff">
                    {seasonEpisodes > 0
                      ? `${Math.round(
                          (seasonWatchedCount / seasonEpisodes) * 100
                        )}%`
                      : "--"}
                  </text>
                </svg>
              </div>
            )}
          </div>
          <p>
            Latest watched: Season {season} • Episode {episode}
          </p>
          <div
            className="cw-stats"
            style={{ display: "flex", gap: 12, marginTop: 6 }}>
            <div className="cw-stat">
              <strong>{hoursTracked}</strong>
              <div className="cw-stat__label">Hours tracked</div>
            </div>
            <div className="cw-stat">
              <strong>{currentStreak}</strong>
              <div className="cw-stat__label">Day streak</div>
            </div>
          </div>
          <div className="cw-actions">
            <button
              className="btn-primary"
              onClick={handleMarkEpisode}
              disabled={marking}>
              {marking
                ? "Marking..."
                : `Mark S${season}E${nextEpisode} as watched`}
            </button>
            {undoAvailable && (
              <button
                className="btn-outline"
                onClick={handleUndo}
                disabled={marking}>
                Undo
              </button>
            )}
            <Link className="btn-link" to={`/tmdb/tv/${current.media_id}`}>
              Open show
            </Link>
          </div>
        </div>
      </div>
      {typeof seasonEpisodes === "number" && (
        <div className="cw-progress">
          <div className="cw-progress__meta">
            Episode {episode} of {seasonEpisodes}
          </div>
          <div className="cw-progress__bar">
            <div
              className="cw-progress__fill"
              style={{
                width: `${Math.min(
                  100,
                  Math.round((episode / seasonEpisodes) * 100)
                )}%`,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContinueWatching;
