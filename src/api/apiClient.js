import axios from "axios";

const baseURL = `${import.meta.env.VITE_API_BASE_URL}/api`;

if (!baseURL) {
  throw new Error("api base url is not defined");
}

const API = axios.create({
  baseURL,
  withCredentials: true,
});

API.interceptors.request.use((configs) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    configs.headers.Authorization = `Bearer ${token}`;
  }
  return configs;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("API ERROR:", error.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default API;
