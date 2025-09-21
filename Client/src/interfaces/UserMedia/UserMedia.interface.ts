import type {
  MediaStatus,
  MediaType,
  ProgressUnit,
} from "../common/MediaSubtypes.interface";
import type { TvTracking } from "./TvTracking.interface";

export interface UserMedia {
  _id?: string;
  user_id: string;
  media_id: string;
  media_type: MediaType;
  media_title: string;
  overview?: string;
  cover_url?: string;
  status?: MediaStatus;
  rating?: number;
  progress?: number;
  progress_units?: ProgressUnit;
  rewatch_count?: number;
  is_favorite?: boolean;
  started_date?: string;
  completed_date?: string;
  tv_tracking?: TvTracking;
  created_at?: string;
  updated_at?: string;
  watched_episodes?: number[];
}
