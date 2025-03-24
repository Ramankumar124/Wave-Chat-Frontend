import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import axiosBaseQuery from "./baseQuery"
import { AxiosResponse } from "axios";
export const userApi=createApi({
 reducerPath:"userApi",
 baseQuery:axiosBaseQuery(),
 tagTypes:["User"],
 endpoints:(builder)=>({
    getUserData:builder.query({
        query:()=>({
          url:"/auth/userData",
        }),
        providesTags:["User"]
    }),
    getAllUsers:builder.query({
      query:()=>({
        url:"/auth/get-all-users"
      }),
      transformResponse:(response:AxiosResponse)=>response.data
    }),
    logoutUser:builder.mutation({
      query:(_arg)=>({
        url:"/auth/logout",
        method:"Post",
      }),
      invalidatesTags:["User"]
    }),
  

 })
});
export const {useGetUserDataQuery,useLogoutUserMutation,useLazyGetAllUsersQuery} =userApi