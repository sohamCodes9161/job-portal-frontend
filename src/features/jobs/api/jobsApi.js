import API from "@/services/api";

export const jobsApi = {
  getAll: ({ search = "", page = 1, limit = 6, sort = "-createdAt", jobType = [] } = {}) => {
    let url = `/jobs?search=${search}&page=${page}&limit=${limit}&sort=${sort}`;
    if (jobType.length > 0) url += `&jobType=${jobType.join(",")}`;
    return API.get(url);
  },

  getById: (id) => API.get(`/jobs/${id}`),

  apply: (id) => API.post(`/jobs/${id}/apply`, {}),
};
