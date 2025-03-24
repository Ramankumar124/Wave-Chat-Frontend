import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

 const Api = axios.create({
  baseURL: "http://localhost:5000/api/v1",
//   baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

Api.interceptors.response.use(
    (response:AxiosResponse)=>response,
    async(error:AxiosError)=>{
        const originalRequest=error.config as AxiosRequestConfig & { _retry?: boolean };
            // Check if the error is due to an expired access token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true; // Mark the request as retried

            try {
                // Attempt to refresh the token
                await axios.post("/refresh-token", {}, { withCredentials: true });
                // Retry the original request
                return Api(originalRequest);
              } catch (refreshError) {
                // Redirect to login if refresh fails
                window.location.href = "/";
                return Promise.reject(refreshError);
              }
        }
        return Promise.reject(error);
    }
)
export default Api