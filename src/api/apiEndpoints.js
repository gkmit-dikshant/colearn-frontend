const endpoints = {
  auth: {
    login: "/auth/login",
    signup: "/auth/signup",
    refresh: "/auth/refresh",
    verifyOtp: "/auth/verify-otp",
    myDetails: "/auth/me",
  },
  projects: {
    create: "/projects",
    getAll: "/projects",
    getById: (projectId) => `/projects/${projectId}`,
    updateById: (projectId) => `/projects/${projectId}`,
    getAllOfLoginUser: (role) => `/projects/me?role=${role}`,
    getMembers: (projectId) => `/projects/${projectId}/members`,
  },
  applications: {
    getAllOfProject: (projectId) => `/applications/projects/${projectId}`,
    getAllOfLoginUser: "/applications/me",
    applyToProject: (projectId) => `/applications/projects/${projectId}`,
    updateStatus: (projectId, applicationId) =>
      `/applications/projects/${projectId}/status/${applicationId}`,
  },
};

export default endpoints;
