import { createSlice,PayloadAction } from "@reduxjs/toolkit";

interface contact{
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
interface Notification {
  message:string,
  messageTime:Date,
  title: string,
  userId:string
}

interface OpenChatState {
  isOpen: boolean;
  contactUserData: contact;
}

interface ChatState {
  notifications: Notification[];
  openChat: OpenChatState;
}
const initialState:ChatState={
  notifications:[],
  openChat:{
    isOpen:false,
    contactUserData:{}
  },
}


export const chatSlice=createSlice({
initialState,
name:"Chat",
reducers:{
setOpenChat:(state,action:PayloadAction<OpenChatState>)=>{
state.openChat=action.payload;
},
addNotification:(state,action:PayloadAction<Notification>)=>{
  state.notifications.push(action.payload);
},
setNotification:(state,action:PayloadAction<Notification[]>)=>{
  state.notifications=action.payload;
}
}
});


export  const {setNotification,setOpenChat,addNotification}=chatSlice.actions;
export  default chatSlice.reducer;