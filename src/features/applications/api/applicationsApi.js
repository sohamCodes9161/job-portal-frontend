import API from "@/services/api";

export const applicationsApi = {
  getMine: () => API.get("/jobs/getmyapplications"),
};
