import axios from "axios";

const API: string = import.meta.env.VITE_TV;

export function searchTv(
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

export function getTvDetails(id: number) {
  return axios.get(`${API}/${id}`, {
    params: {
      append_to_response: "videos,images,credits",
    },
  });
}

export function getPopularTv(pages: number = 1) {
  return axios.get(`${API}/popular`, {
    params: {
      page: pages,
    },
  });
}

export function getTrendingTv(pages: number = 1) {
  return axios.get(`${API}/trending`, {
    params: {
      page: pages,
    },
  });
}

export function getUpcomingTvs(pages: number = 1) {
  return axios.get(`${API}/upcoming`, {
    params: {
      page: pages,
    },
  });
}

export function getTvRecommendations(id: number, pages: number = 1) {
  return axios.get(`${API}/${id}/recommendations`, {
    params: {
      page: pages,
    },
  });
}

export function getTvGenres() {
  return axios.get(`${API}/genres`);
}

export function getTvCredits(id: number) {
  return axios.get(`${API}/${id}/credits`);
}

export function getTvSeason(id: number, seasonNumber: number) {
  return axios.get(`${API}/${id}/season/${seasonNumber}`, {
    params: {
      append_to_response: "credits",
    },
  });
}

export function getTvEpisode(
  id: number,
  seasonNumber: number,
  episodeNumber: number
) {
  return axios.get(
    `${API}/${id}/season/${seasonNumber}/episode/${episodeNumber}`,
    {
      params: {
        append_to_response: "credits",
      },
    }
  );
}
