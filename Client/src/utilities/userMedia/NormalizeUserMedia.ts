export interface normalizeUserMedia {
  _id?: string;
  user_id: string;
  media_id: string;
  media_type: "movie" | "tv" | "book" | "anime" | "game" | "unknown";
  media_title: string;
  overview?: string;
  cover_url?: string;
  status?: "watching" | "completed" | "plan_to_watch" | "dropped" | "on_hold";
  rating?: number;
  progress?: number;
  progress_units?:
    | "episodes"
    | "chapters"
    | "volumes"
    | "minutes"
    | "hours"
    | "percent";
  rewatch_count?: number;
  is_favorite?: boolean;
  started_date?: string;
  completed_date?: string;
  tv_tracking?: {
    current_season?: number;
    current_episode?: number;
    episode_watch_history?: {
      episode_number: number;
      season_number: number;
      watched_at: Date;
    }[];
  };
  created_at?: string;
  updated_at?: string;
}
