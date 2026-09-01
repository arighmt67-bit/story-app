import CONFIG from '../config';
import { getAccessToken } from '../utils/auth';

const ENDPOINTS = {
  REGISTER: `${CONFIG.BASE_URL}/register`,
  LOGIN: `${CONFIG.BASE_URL}/login`,
  STORIES: `${CONFIG.BASE_URL}/stories`,
};

async function parseResponse(response) {
  const json = await response.json();
  if (!response.ok || json.error) {
    throw new Error(json.message || `Permintaan gagal (HTTP ${response.status}).`);
  }
  return json;
}

export async function register({ name, email, password }) {
  const response = await fetch(ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return parseResponse(response);
}

export async function login({ email, password }) {
  const response = await fetch(ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return parseResponse(response);
}

export async function getStories({ page = 1, size = 20, location = 1 } = {}) {
  const url = `${ENDPOINTS.STORIES}?page=${page}&size=${size}&location=${location}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${getAccessToken()}` },
  });
  return parseResponse(response);
}

export async function addStory({ description, photo, lat, lon }) {
  const formData = new FormData();
  formData.append('description', description);
  formData.append('photo', photo);
  if (lat !== null && lat !== undefined) formData.append('lat', lat);
  if (lon !== null && lon !== undefined) formData.append('lon', lon);

  const response = await fetch(ENDPOINTS.STORIES, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getAccessToken()}` },
    body: formData,
  });
  return parseResponse(response);
}
