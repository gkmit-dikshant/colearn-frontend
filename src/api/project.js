import API from "./apiClient";
import endpoints from "./apiEndpoints";
export const projectService = {
  create: async (title, description, skills, locations_id) => {
    const resp = await API.post(endpoints.projects.create, {
      title,
      description,
      skills,
      locations_id,
    });
    return resp.data;
  },
  getById: async (projectId) => {
    const resp = await API.get(endpoints.projects.getById(projectId));
    return resp.data;
  },
  getAll: async () => {
    const resp = await API.get(endpoints.projects.getAll);
    return resp.data;
  },
  getAllofLoginUser: async () => {
    const resp = await API.get(endpoints.projects.getAllOfLoginUser);
    return resp.data;
  },
};
