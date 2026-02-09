const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const API = {
  users: () => 
    `${API_BASE_URL}/user`
};