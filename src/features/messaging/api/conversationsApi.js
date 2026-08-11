import API from "@/services/api";

export const conversationsApi = {
  // Get-or-create the single conversation for (this job, current candidate).
  // Called from the small message icon on the Job Details page.
  getOrCreate: (jobId) => API.post(`/conversations/job/${jobId}`),

  // Inbox listing — role-aware on the backend (candidate vs recruiter)
  getMine: () => API.get("/conversations"),

  getById: (id) => API.get(`/conversations/${id}`),
};
