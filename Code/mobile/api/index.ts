const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL;

export const API = {
  // ─── Auth & Users ───
  // UserController: @RequestMapping("/api/v1/user")
  login: () => `${API_BASE_URL}/user/login`,
  register: () => `${API_BASE_URL}/user/register`,
  refresh: () => `${API_BASE_URL}/user/refresh`,
  logout: () => `${API_BASE_URL}/user/logout`,

  users: () => `${API_BASE_URL}/user`,
  userById: (id: string) => `${API_BASE_URL}/user/${id}`,
  userByEmail: (email: string) => `${API_BASE_URL}/user/by-email?email=${email}`,
  updateUser: (id: string) => `${API_BASE_URL}/user/${id}`,
  updateAge: (id: string) => `${API_BASE_URL}/user/${id}/age`,
  updateGender: (id: string) => `${API_BASE_URL}/user/${id}/gender`,
  updateClinicalStory: (id: string) => `${API_BASE_URL}/user/${id}/clinical-story`,
  updateNotes: (id: string) => `${API_BASE_URL}/user/${id}/notes`,
  deleteUser: (id: string) => `${API_BASE_URL}/user/${id}`,

  // ─── Activities ───
  // ActivityController: @RequestMapping("/api/v1/activities")
  activities: () => `${API_BASE_URL}/activities`,
  activityById: (id: string) => `${API_BASE_URL}/activities/${id}`,
  activitiesByCategory: (category: string) => `${API_BASE_URL}/activities/by-category?category=${category}`,
  activitiesByUser: (userId: string) => `${API_BASE_URL}/activities/user/${userId}`,

  
};