import API from "@/services/api";

export const notificationsApi = {
  getAll: () => API.get("/notifications"),

  markRead: (id) => API.patch(`/notifications/${id}/read`),

  markAllRead: () => API.patch("/notifications/read-all"),
};
