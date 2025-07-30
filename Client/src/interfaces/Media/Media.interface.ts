import type { MediaType } from "../common/MediaSubtypes.interface";

export interface Media {
  _id?: string;
  id?: number; // TMDB id
  title?: string;
  name?: string;
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
  type?: MediaType;
  createdAt?: string;
  updatedAt?: string;
}
