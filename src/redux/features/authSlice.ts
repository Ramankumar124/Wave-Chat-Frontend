import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import axiosBaseQuery from "../api/baseQuery"
import axios from "axios";
import { server } from "@/constants/config";

export interface contact{
  _id:string,
  name: string;
  email: string;
  bio?: string;
  isOnline: boolean;
  avatar: {
    public_id: string;
    url: string;
    _id: string;
  };
  firebaseToken:string,
}
export interface User {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  contacts: contact[];
  firebaseToken?: string;
  isOnline: boolean;
  friendRequest: {
    sent: object;
    received: object;
  };
  isEmailVerified: boolean;
  avatar: {
    public_id: string;
    url: string;
    _id: string;
  };
}

interface AuthSliceState {
  loader: boolean;
  user: User | null;
}

const initialState: AuthSliceState = {
  loader: true,
  user: null,
};

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async () => {
    const response = await axios.get(`${server}/api/v1/auth/getUserData`, { withCredentials: true });
    console.log(response.data);
    
    return response.data.data; // This will be the payload of the fulfilled action
  }
);

 export const authSlice = createSlice({
  initialState,
  name: "auth",
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.loader = false;
    },
    removeUserData: (state) => {
      state.user = null;
      state.loader = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loader = true; // Data is being fetched
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.user = action.payload; // Set user data
        state.loader = false; // Data fetching is complete
      })
      .addCase(fetchUserData.rejected, (state) => {
        state.loader = false; // Data fetching failed
        state.user = null;    // Clear user data
      });
  },
});

export const {setUserData,removeUserData} =authSlice.actions