import axios from "axios";

const MOVIE_API: string = import.meta.env.VITE_MOVIE;

export function searchMovies(
  query: string,
  pages: number = 1,
  includeAdult: boolean = false
) {
  return axios.get(`${MOVIE_API}/search`, {
    params: {
      query,
      page: pages,
      include_adult: includeAdult,
    },
  });
}

export function getMovieDetails(id: number | string) {
  return axios.get(`${MOVIE_API}/${id}`, {
    params: {
      append_to_response: "videos,images,credits",
    },
  });
}

export function getPopularMovies(pages: number = 1) {
  return axios.get(`${MOVIE_API}/popular`, {
    params: {
      page: pages,
    },
  });
}

export function getTrendingMovies(pages: number = 1) {
  return axios.get(`${MOVIE_API}/trending`, {
    params: {
      page: pages,
    },
  });
}

export function getUpcomingMovies(pages: number = 1) {
  return axios.get(`${MOVIE_API}/upcoming`, {
    params: {
      page: pages,
    },
  });
}

export function getMovieRecommendations(id: number, pages: number = 1) {
  return axios.get(`${MOVIE_API}/${id}/recommendations`, {
    params: {
      page: pages,
    },
  });
}

export function getMovieGenres() {
  return axios.get(`${MOVIE_API}/genres`);
}

export function getMovieCredits(id: number) {
  return axios.get(`${MOVIE_API}/${id}/credits`);
}
