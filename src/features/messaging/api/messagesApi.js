import API from "@/services/api";

export const messagesApi = {
  getThread: (conversationId) => API.get(`/conversations/${conversationId}/messages`),

  send: (conversationId, body) =>
    API.post(`/conversations/${conversationId}/messages`, { body }),
};
