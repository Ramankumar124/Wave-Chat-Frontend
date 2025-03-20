import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/authSlice";
import { userApi } from "../api/apiSlice";
import { chatSlice } from "../features/chatSlice";
import { appSlice } from "../features/applSlice";
export const store = configureStore({
  reducer: {
    [authSlice.reducerPath]: authSlice.reducer,
    [userApi.reducerPath]: userApi.reducer,
    [chatSlice.reducerPath]:chatSlice.reducer,
    app:appSlice.reducer,

  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userApi.middleware),
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
