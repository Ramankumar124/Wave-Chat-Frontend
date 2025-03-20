import { createSlice,PayloadAction } from "@reduxjs/toolkit";
interface appSlice{
toggleCallBox:boolean,
isCallActive:boolean,
stream:any,
theme:string,

}

const initialState:appSlice={
toggleCallBox:false,
isCallActive:false,
stream:null,
theme:"coffie"

}

export const appSlice=createSlice({
initialState,
name:"app",
reducers:{
setTheme:(state,action:PayloadAction<string>)=>{
    state.theme=action.payload;
},
setToggleCallBox:(state,action:PayloadAction<boolean>)=>{
 state.toggleCallBox=action.payload;
},
setIsCallActive:(state,action:PayloadAction<boolean>)=>{
state.isCallActive=action.payload
},
setStream:(state,action:PayloadAction<any>)=>{
    state.stream=action.payload
    }
}
})

export const {setIsCallActive,setStream,setTheme,setToggleCallBox}=appSlice.actions