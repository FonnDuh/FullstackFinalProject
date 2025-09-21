import { useEffect, useState, type FunctionComponent } from "react";
import { getMediaDetails } from "../../services/tmdb/tmdb.service";
import { updateMediaForUser } from "../../services/userMedia.service";
import { successMessage, errorMessage } from "../../services/feedback.service";
import { useAuth } from "../../hooks/useAuth";
import type { UserMedia } from "../../interfaces/UserMedia/UserMedia.interface";
import type {
  MediaStatus,
  MediaType,
} from "../../interfaces/common/MediaSubtypes.interface";
import "./MediaTracking.css";
import type { TmdbTvDetails } from "../../interfaces/Media/TmdbTvDetails";

interface MediaTrackingProps {
  mediaId: string;
  mediaType: MediaType;
  existingMedia: UserMedia | null;
}

const MediaTracking: FunctionComponent<MediaTrackingProps> = ({
  mediaId,
  mediaType,
  existingMedia,
}) => {
  const { user } = useAuth();
  const [tvDetails, setTvDetails] = useState<TmdbTvDetails | null>(null);
  const [watchStatus, setWatchStatus] = useState(
    existingMedia?.status || "Plan to Watch"
  );
  const [watchedEpisodes, setWatchedEpisodes] = useState<number[]>(
    existingMedia?.watched_episodes || []
  );
  const [selectedSeason, setSelectedSeason] = useState<number | null>(
    existingMedia?.tv_tracking?.current_season ?? null
  );
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>(
    existingMedia?.tv_tracking?.current_episode ?? null
  );

  useEffect(() => {
    if (mediaType === "tv") {
      const fetchTvDetails = async () => {
        try {
          const res = await getMediaDetails("tv", Number(mediaId));
          setTvDetails(res.data);
        } catch (error) {
          console.error("Error fetching TV details:", error);
        }
      };

      fetchTvDetails();
    }
  }, [mediaId, mediaType]);

  const handleStatusChange = async (status: MediaStatus) => {
    if (!user || !existingMedia || !existingMedia._id) return;

    try {
      const updated = await updateMediaForUser(existingMedia._id, { status });
      setWatchStatus(updated.data.status);
    } catch (error) {
      console.error("Error updating watch status:", error);
    }
  };

  const handleEpisodeToggle = async (episodeNumber: number) => {
    if (!user || !existingMedia || !existingMedia._id) return;

    const updatedEpisodes = watchedEpisodes.includes(episodeNumber)
      ? watchedEpisodes.filter((ep) => ep !== episodeNumber)
      : [...watchedEpisodes, episodeNumber];

    try {
      const updated = await updateMediaForUser(existingMedia._id, {
        watched_episodes: updatedEpisodes,
      });
      setWatchedEpisodes(updated.data.watched_episodes);
    } catch (error) {
      console.error("Error updating watched episodes:", error);
    }
  };

  useEffect(() => {
    // sync selected season/episode when existingMedia changes
    if (existingMedia && existingMedia.tv_tracking) {
      setSelectedSeason(existingMedia.tv_tracking.current_season ?? null);
      setSelectedEpisode(existingMedia.tv_tracking.current_episode ?? null);
    } else {
      setSelectedSeason(null);
      setSelectedEpisode(null);
    }
  }, [existingMedia]);

  const handleUpdateTvProgress = async () => {
    if (!existingMedia || !existingMedia._id) {
      errorMessage("Add this show to your list first to track progress.");
      return;
    }

    try {
      const payload: Partial<UserMedia> = {
        tv_tracking: {
          current_season: selectedSeason ?? undefined,
          current_episode: selectedEpisode ?? undefined,
        },
      };

      const updated = await updateMediaForUser(existingMedia._id, payload);
      if (updated && updated.data) {
        // update local state from response
        // caller (parent) may also update existingMedia when it re-fetches, but sync locally
        // Note: we only update watched_episodes/watch status in this component
        successMessage("Progress updated");
      }
    } catch (err) {
      console.error("Error updating TV progress:", err);
      errorMessage("Failed to update progress.");
    }
  };

  return (
    <div className="media-tracking">
      <h3>Watch Status</h3>
      <select
        value={watchStatus}
        onChange={(e) => handleStatusChange(e.target.value as MediaStatus)}>
        <option value="Plan to Watch">Plan to Watch</option>
        <option value="Watching">Watching</option>
        <option value="Completed">Completed</option>
        <option value="Dropped">Dropped</option>
      </select>

      {mediaType === "tv" && tvDetails && (
        <div className="tv-tracking">
          <h4>Episodes</h4>
          {tvDetails.seasons &&
            tvDetails.seasons.map((season) => (
              <div key={season.id} className="season">
                <h5>Season {season.season_number}</h5>
                <ul>
                  {Array.from(
                    { length: season.episode_count ?? 0 },
                    (_, i) => i + 1
                  ).map((episodeNumber) => (
                    <li key={episodeNumber}>
                      <label>
                        <input
                          type="checkbox"
                          checked={watchedEpisodes.includes(episodeNumber)}
                          onChange={() => handleEpisodeToggle(episodeNumber)}
                        />
                        Episode {episodeNumber}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          <div className="tv-progress" style={{ marginTop: 12 }}>
            <h5>Track TV Progress</h5>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <label>
                Season
                <select
                  value={selectedSeason ?? ""}
                  onChange={(e) => {
                    const v = e.target.value ? Number(e.target.value) : null;
                    setSelectedSeason(v);
                    setSelectedEpisode(null);
                  }}>
                  <option value="">Select</option>
                  {tvDetails.seasons?.map((s) => (
                    <option key={s.id} value={s.season_number}>
                      {s.season_number}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Episode
                <select
                  value={selectedEpisode ?? ""}
                  onChange={(e) =>
                    setSelectedEpisode(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }>
                  <option value="">Select</option>
                  {(() => {
                    const season = tvDetails.seasons?.find(
                      (s) => s.season_number === selectedSeason
                    );
                    const count = season?.episode_count ?? 0;
                    return Array.from({ length: count }, (_, i) => i + 1).map(
                      (n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      )
                    );
                  })()}
                </select>
              </label>

              <button
                className="media-action-btn"
                onClick={handleUpdateTvProgress}>
                Update Progress
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaTracking;
