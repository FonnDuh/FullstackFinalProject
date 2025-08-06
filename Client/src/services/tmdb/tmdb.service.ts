import axios from "axios";

const TMDB_API: string = import.meta.env.VITE_TMDB;

export function searchMedia(
  type:
    | "movie"
    | "tv"
    | "person"
    | "company"
    | "collection"
    | "keyword"
    | "multi",
  query: string,
  pages: number = 1,
  includeAdult: boolean = false
) {
  return axios.get(`${TMDB_API}/search/${type}`, {
    params: {
      query,
      page: pages,
      include_adult: includeAdult,
    },
  });
}

export function getMediaGenres(type: "movie" | "tv") {
  return axios.get(`${TMDB_API}/genre/${type}`);
}

export function getPopularMedia(
  type: "movie" | "tv" | "person",
  pages: number = 1
) {
  return axios.get(`${TMDB_API}/popular/${type}`, {
    params: {
      page: pages,
    },
  });
}

export function getTrendingMedia(
  type: "all" | "movie" | "tv" | "person",
  timeWindow: "day" | "week",
  pages: number = 1
) {
  return axios.get(`${TMDB_API}/trending/${type}/${timeWindow}`, {
    params: {
      page: pages,
    },
  });
}

export function getTopRatedMedia(type: "movie" | "tv", pages: number = 1) {
  return axios.get(`${TMDB_API}/top_rated/${type}`, {
    params: {
      page: pages,
    },
  });
}

export function getMediaDetails(
  type:
    | "movie"
    | "tv"
    | "person"
    | "company"
    | "collection"
    | "keyword"
    | "multi",
  id: number | string
) {
  return axios.get(`${TMDB_API}/${type}/${id}`, {
    params: {
      append_to_response: "videos,images,credits",
    },
  });
}

export function getMediaRecommendations(
  type: "tv" | "movie",
  id: number,
  pages: number = 1
) {
  return axios.get(`${TMDB_API}/${type}/${id}/recommendations`, {
    params: {
      page: pages,
    },
  });
}

export function getMediaCredits(type: "tv" | "movie", id: number) {
  return axios.get(`${TMDB_API}/${type}/${id}/credits`);
}
