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
    getChat:builder.query<AxiosResponse, { contactUserId: string; page: number }>({
      query: ({ contactUserId, page }) => ({
        url: `/chat/${contactUserId}?page=${page}`,
        method: 'GET'
      }),
    })
  

 })
});
export const {useGetUserDataQuery} =userApi