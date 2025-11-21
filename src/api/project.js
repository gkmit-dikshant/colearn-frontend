import API from "./apiClient";
import endpoints from "./apiEndpoints";
export const projectService = {
  create: async (title, description, skills, location_id) => {
    const resp = await API.post(endpoints.projects.create, {
      title,
      description,
      skills,
      location_id,
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
  getAllofLoginUser: async (role) => {
    const resp = await API.get(endpoints.projects.getAllOfLoginUser(role));
    return resp.data;
  },
  update: async (projectId, data) => {
    const resp = await API.patch(
      endpoints.projects.updateById(projectId),
      data,
    );
    return resp.data;
  },
  getMembers: async (projectId) => {
    const resp = await API.get(endpoints.projects.getMembers(projectId));
    return resp.data;
  },
};
