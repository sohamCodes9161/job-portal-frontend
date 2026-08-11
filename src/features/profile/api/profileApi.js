import API from "@/services/api";

export const profileApi = {
  getMe: () => API.get("/users/me"),

  update: (id, data) => API.put(`/users/${id}`, data),

  uploadResume: (formData) =>
    API.post("/users/upload-resume", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  uploadAvatar: (formData) =>
    API.post("/users/upload-avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getPublicProfile: (id) => API.get(`/users/${id}`),
};
