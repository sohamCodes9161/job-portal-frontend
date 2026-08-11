import API from "@/services/api";

export const adminApi = {
  getDashboardStats: () => API.get("/jobs/dashboard-stats"),

  getMyJobs: () => API.get("/jobs/my-jobs"),

  createJob: (data) => API.post("/jobs", data),

  updateJob: (id, data) => API.put(`/jobs/${id}`, data),

  deleteJob: (id) => API.delete(`/jobs/${id}`),

  getApplicants: (jobId) => API.get(`/jobs/${jobId}/applicants`),

  updateApplicationStatus: (applicationId, status) =>
    API.put(`/jobs/${applicationId}/update`, { status }),
};
