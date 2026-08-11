import API from "@/services/api";

export const authApi = {
  login: (credentials) => API.post("/users/login", credentials),
  register: (data) => API.post("/users/register", data),
  logout: () => API.post("/users/logout"),
  refresh: (refreshToken) => API.post("/users/refresh", { refreshToken }),
};
