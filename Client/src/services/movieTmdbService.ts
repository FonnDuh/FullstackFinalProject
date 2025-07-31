import axios from "axios";

const API: string = import.meta.env.VITE_MOVIE;

export function searchMovies(
  query: string,
  pages: number = 1,
  includeAdult: boolean = false
) {
  return axios.get(`${API}/search`, {
    params: {
      query,
      page: pages,
      include_adult: includeAdult,
    },
  });
}

export function getMovieDetails(id: number) {
  return axios.get(`${API}/${id}`, {
    params: {
      append_to_response: "videos,images,credits",
    },
  });
}

export function getPopularMovies(pages: number = 1) {
  return axios.get(`${API}/popular`, {
    params: {
      page: pages,
    },
  });
}

export function getTrendingMovies(pages: number = 1) {
  return axios.get(`${API}/trending`, {
    params: {
      page: pages,
    },
  });
}

export function getUpcomingMovies(pages: number = 1) {
  return axios.get(`${API}/upcoming`, {
    params: {
      page: pages,
    },
  });
}

export function getMovieRecommendations(id: number, pages: number = 1) {
  return axios.get(`${API}/${id}/recommendations`, {
    params: {
      page: pages,
    },
  });
}

export function getMovieGenres() {
  return axios.get(`${API}/genres`);
}

export function getMovieCredits(id: number) {
  return axios.get(`${API}/${id}/credits`);
}
