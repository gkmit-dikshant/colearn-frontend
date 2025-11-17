const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    verifyOtp: "/auth/verify-otp",
  },
  projects: {
    create: "/projects",
    getAll: "/projects",
    getById: (projectId) => `/projects/${projectId}`,
    getAllOfLoginUser: (userId) => `/projects/${userId}`,
  },
  applications: {
    getAllOfProject: (projectId) => `/applications/projects/${projectId}`,
    getAllOfLoginUser: "/applications/me",
    applyToProject: (projectId) => `/applications/projects/${projectId}`,
    updateStatus: (projectId, applicationId) =>
      `/applications/${projectId}/status/${applicationId}`,
  },
};

export default endpoints;
