export interface IUserMedia {
  user_id: string; // Mongo ObjectId string
  media_id: string; // Mongo ObjectId string
  status?: "watching" | "completed" | "plan_to_watch" | "dropped" | "on_hold";
  rating?: number; // 1 to 10
  progress?: number;
  is_favorite?: boolean;
  started_date?: string; // ISO date string
  completed_date?: string; // ISO date string
  notes?: string;
  updated_at?: string; // auto-updated timestamp
}
