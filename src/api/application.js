import API from "./apiClient";
import endpoints from "./apiEndpoints";

export const applicationService = {
  getAllOfProject: async (projectId) => {
    const resp = await API.get(
      endpoints.applications.getAllOfProject(projectId),
    );
    return resp.data;
  },
  getAllOfLoginUser: async () => {
    const resp = await API.get(endpoints.applications.getAllOfLoginUser);
    return resp.data;
  },
  applyToProject: async (projectId) => {
    const resp = await API.post(
      endpoints.applications.applyToProject(projectId),
    );
    return resp.data;
  },
  updateStatus: async (projectId, applicationId) => {
    const resp = await API.post(
      endpoints.applications.updateStatus(projectId, applicationId),
    );
    return resp;
  },
};
