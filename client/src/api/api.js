import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api", // Change if needed
  withCredentials: true
});

// Interceptor to attach JWT token
// api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("token"); // or sessionStorage, based on your use
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Response interceptor: auto refresh access token


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Call refresh endpoint
        await api.post("/auth/refresh");

        // Retry original request
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Refresh token expired:", refreshError);
        // Optionally logout user here
      }
    }
    return Promise.reject(error);
  }
);

export default api;
