import API from "@/services/api";

export const messagesApi = {
  getThread: (applicationId) => API.get(`/applications/${applicationId}/messages`),

  send: (applicationId, body) =>
    API.post(`/applications/${applicationId}/messages`, { body }),
};
