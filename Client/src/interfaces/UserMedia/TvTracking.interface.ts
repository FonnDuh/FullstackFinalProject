export interface TvTracking {
  current_season?: number;
  current_episode?: number;
  episode_watch_history?: {
    episode_number: number;
    season_number: number;
    watched_at: Date;
  }[];
}
