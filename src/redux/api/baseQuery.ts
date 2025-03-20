import { BaseQueryFn } from "@reduxjs/toolkit/query";
import { AxiosRequestConfig, AxiosError } from "axios";
import Api from "../../api";

// Define the shape of the arguments for the custom base query
type AxiosBaseQueryArgs = {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
};

// Define the shape of the error response
type AxiosBaseQueryError = {
  status?: number;
  data?: unknown;
};

// Create a custom base query using Axios
const axiosBaseQuery =
  (): BaseQueryFn<AxiosBaseQueryArgs, unknown, AxiosBaseQueryError> =>
  async ({ url, method = "GET", data, params }) => {
    try {
      const result = await Api({
        url,
        method,
        data,
        params,
      });
      return { data: result.data };
    } catch (axiosError) {
      const err = axiosError as AxiosError;
      return {
        error: {
          status: err.response?.status,
          data: err.response?.data,
        },
      };
    }
  };

export default axiosBaseQuery;