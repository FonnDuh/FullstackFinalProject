import axios from "axios";

const TMDB_API: string = import.meta.env.VITE_TMDB;
const mediaType = "movie";

export function getNowPlayingMovies(pages: number = 1) {
  return axios.get(`${TMDB_API}/${mediaType}/now_playing`, {
    params: {
      page: pages,
    },
  });
}

export function getUpcomingMovies(pages: number = 1) {
  return axios.get(`${TMDB_API}/${mediaType}/upcoming`, {
    params: {
      page: pages,
    },
  });
}
