export interface Episode {
  title: string;
  season: number;
  episode_number: number;
  air_date?: string;
}

export interface Media {
  _id?: string;
  id?: number; // TMDB id
  title?: string;
  name?: string; // TV shows
  original_name?: string;
  original_language?: string;
  overview?: string;
  adult?: boolean;
  backdrop_path?: string;
  poster_path?: string;
  genre_ids?: number[];
  genres?: string[];
  origin_country?: string[];
  release_date?: string;
  first_air_date?: string;
  popularity?: number;
  vote_average?: number;
  vote_count?: number;
  type?: "movie" | "tv" | "book" | "anime" | "game" | "unknown";
  createdAt?: string;
  updatedAt?: string;
}
