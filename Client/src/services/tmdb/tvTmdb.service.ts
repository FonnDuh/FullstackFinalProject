import axios from "axios";

const TMDB_API: string = import.meta.env.VITE_TMDB;
const mediaType = "tv";

export function getAiringTodayTv() {
  return axios.get(`${TMDB_API}/${mediaType}/airing_today`);
}

export function getOnTheAirTv() {
  return axios.get(`${TMDB_API}/${mediaType}/on_the_air`);
}

export function getTvSeason(id: number, seasonNumber: number) {
  return axios.get(`${TMDB_API}/${mediaType}/${id}/season/${seasonNumber}`, {
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
    `${TMDB_API}/${mediaType}/${id}/season/${seasonNumber}/episode/${episodeNumber}`,
    {
      params: {
        append_to_response: "credits",
      },
    }
  );
}
