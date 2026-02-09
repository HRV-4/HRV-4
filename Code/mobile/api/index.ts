const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const API = {
  users: () => `${API_BASE_URL}/users`,
  login: () => `${API_BASE_URL}/user/login`,
  register: () => `${API_BASE_URL}/user/register`,
};