export type MediaType =
  | "all"
  | "movie"
  | "tv"
  | "book"
  | "anime"
  | "game"
  | "unknown";
export type MediaStatus =
  | "all"
  | "watching"
  | "completed"
  | "plan_to_watch"
  | "dropped"
  | "on_hold";
export type ProgressUnit =
  | "episodes"
  | "chapters"
  | "volumes"
  | "minutes"
  | "hours"
  | "percent";
export type MediaSort =
  | "popularity_desc"
  | "popularity_asc"
  | "rating_desc"
  | "rating_asc"
  | "title_asc"
  | "title_desc"
  | "release_desc"
  | "release_asc";
