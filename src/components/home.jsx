import React, { useEffect, useState } from "react";
import Sidebar from "../components/allChatsSideBar/SideBar";
import ChatBox from "../components/ChatBox/ChatBox";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Header from "./Header/Header";
const Home = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      navigate("/");
    }
  }, []);
  return (
    <div className="w-screen h-screen">
      <Header />
      <div className="flex w-full h-[93%]">
        <Sidebar />
        <ChatBox />
      </div>
    </div>
  );
};

export default Home;
