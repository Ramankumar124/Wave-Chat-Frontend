import React, { useEffect, useState } from "react";
import Sidebar from "../../components/ChatSideBar/SideBar";
import ChatBox from "../../components/ChatBox/ChatBox";
import Header from "../../components/Header/Header";
const Home = () => {
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
