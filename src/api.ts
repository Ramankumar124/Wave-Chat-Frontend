import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { useNavigate } from "react-router-dom";
import { server } from "./constants/config";

const Api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  //   baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await axios.post(
          `${server}/api/v1/auth/refresh-token`,
          {},
          { withCredentials: true }
        );

        return Api(originalRequest);
      } catch (refreshError) {
        const navigate = useNavigate();
        navigate("/login");
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
export default Api;
