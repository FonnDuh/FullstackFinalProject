import axios from "axios";
import type { UserMedia } from "../interfaces/UserMedia/UserMedia.interface";

const API: string = import.meta.env.VITE_MEDIA;

export function createMedia(media: UserMedia) {
  return axios.post(API, media, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function getAllMediaForUser() {
  return axios.get(API, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function getMediaById(id: string) {
  return axios.get(`${API}/${id}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function getAllMediaByUserId(userId: string) {
  return axios.get(`${API}/user/${userId}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function getMediaByStatus(status: string) {
  return axios.get(`${API}/status/${status}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function getMediaByType(mediaType: string) {
  return axios.get(`${API}/type/${mediaType}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function updateMediaForUser(
  id: string,
  updatedMedia: Partial<UserMedia>
) {
  return axios.put(`${API}/${id}`, updatedMedia, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function deleteMediaByBothId(userId: string, mediaId: string) {
  return axios.delete(`${API}/user/${userId}/media/${mediaId}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function deleteMediaForUser(id: string) {
  return axios.delete(`${API}/${id}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}

export function deleteAllMediaByUserId(userId: string) {
  return axios.delete(`${API}/user/${userId}`, {
    headers: {
      "Auth-Token": sessionStorage.getItem("token"),
    },
  });
}
