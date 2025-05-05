import React, { useEffect, useState } from "react";
import Sidebar from "../../components/ChatSideBar/SideBar";
import ChatBox from "../../components/ChatBox/ChatBox";
import Header from "../../components/Header/Header";
const Home = () => {
  return (
    <div className="w-screen h-screen overflow-hidden">
      <Header />
      <div className="flex w-full h-[95%] md:h-[90%] overflow-hidden">
        <Sidebar />
        <ChatBox />
      </div>
    </div>
  );
};

export default Home;
