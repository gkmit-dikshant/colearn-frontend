import API from "./apiClient";
import endpoints from "./apiEndpoints";

const authService = {
  login: async (email, password) => {
    const resp = await API.post(endpoints.auth.login, { email, password });
    return resp.data;
  },
  signup: async (name, email, password, bio = null) => {
    const resp = await API.post(endpoints.auth.signup, {
      name,
      email,
      password,
      bio,
    });
    return resp.data;
  },
  verifyOtp: async (email, otp) => {
    const resp = await API.post(endpoints.auth.verifyOtp, { email, otp });
    return resp.data;
  },
  refresh: async (email, refreshToken) => {
    const resp = await API.post(endpoints.auth.refresh, {
      email,
      refreshToken,
    });
    return resp.data;
  },
  getMyDetails: async () => {
    const resp = await API.get(endpoints.auth.myDetails);
    return resp.data;
  }
};

export default authService;
