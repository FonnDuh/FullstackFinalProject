export interface IEpisode {
  title: string;
  season: number;
  episode_number: number;
  air_date?: string; // ISO date
}

export interface IMedia {
  _id?: string; // optional for frontend use
  title: string;
  type: "movie" | "tv" | "book" | "anime" | "game";
  genres?: string[];
  release_date?: string; // ISO date string
  poster_url?: string;
  backdrop_url?: string;
  description?: string;
  external_id?: string;
  rating?: number;
  duration?: number; // in minutes
  status?: "released" | "upcoming" | "ongoing";
  director?: string;
  cast?: string[];
  trailer_url?: string;
  tags?: string[];
  episodes?: IEpisode[];
  createdAt?: string;
  updatedAt?: string;
}
