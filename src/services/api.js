import axios from "axios";

const API = axios.create({
  baseURL: "https://job-portal-backend-9mmi.onrender.com/api",
});

/* REQUEST INTERCEPTOR */
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  return config;
});

/* RESPONSE INTERCEPTOR */
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          localStorage.clear();
          window.location.href = "/login";
          return Promise.reject(error);
        }

        // ✅ FIXED HERE
        const res = await API.post("/users/refresh", {
          refreshToken,
        });

        const newToken = res.data.token;

        localStorage.setItem("token", newToken);

        API.defaults.headers.common["Authorization"] =
          `Bearer ${newToken}`;

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        return API(originalRequest);
      } catch (err) {
        console.log("Refresh failed:", err.message);

        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default API;
