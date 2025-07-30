export type MediaType = "movie" | "tv" | "book" | "anime" | "game" | "unknown";
export type MediaStatus =
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