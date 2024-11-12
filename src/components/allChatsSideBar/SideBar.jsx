import React, { useEffect, useState } from "react";
import { userData } from "@/userData";
import api from '@/api'
import Cookies from 'js-cookie'
import { io } from "socket.io-client";
import { useUser } from "@/context/UserContext";



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"


const main = () => {
  const [Contacts, setContacts] = useState([]);
  const {openChat,setopenChat}=useUser();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userData();
        // console.log(data);
        setContacts(data.contacts);
   
        
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);


  const handleLogout = async () => {
    console.log("hello");
    try {
        const response = await api.get('/auth/logout'); 
        location.reload(); 
        Cookies.remove('token'); 
    } catch (error) {
        console.log("Error during logout:", error);
    }
}

  return (
    <div className="w-1/3 h-full bg-gray-900 flex border-gray-500 border-r-2 text-white">
      <div
        id="sideMenubar"
        className="w-16 h-full p-4 text-2xl font-bold bg-gray-600 text-white  flex flex-col justify-between"
      >
        <div className="flex flex-col gap-7">
          <i class="fa-regular fa-comment-dots"></i>
          <i class="fa-regular fa-life-ring"></i>
          <i class="fa-solid fa-comment"></i>
          <i class="fa-solid fa-users"></i>
        </div>
        <div>
          <i class="fa-solid fa-gear"></i>
          <div className="w-4 h-4 rounded-full bg-red-500"></div>
        </div>
      </div>
      <div id="mainChat" className="w-full h-full flex flex-col items">
        <div
          id="topBar"
          className=" p-3 px-8 text-white flex justify-between text-2xl font-bold "
        >
          <p>Chats</p>
          <div className="flex gap-4">
            <i class="fa-solid fa-comment-medical"></i>
          <DropdownMenu>
  <DropdownMenuTrigger>  <i class="fa-solid fa-ellipsis-vertical w-4"></i></DropdownMenuTrigger>
  <DropdownMenuContent className="bg-slate-400 ">
    <DropdownMenuLabel >My Account</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
    <DropdownMenuItem>Billing</DropdownMenuItem>
    <DropdownMenuItem>Team</DropdownMenuItem>
    <DropdownMenuItem>Subscription</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

          </div>
        </div>
        <div className="bg-gray-700 mr-10 px-3 h-8 gap-8 w-full rounded-md flex items-center ">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input
            className="bg-gray-700 rounded-lg h-full "
            type="text"
            placeholder="Seach"
          />
        </div>

        <div className="flex-grow overflow-y-auto">
          {Contacts.map((user) => (
            <div
              key={user._id}
              onClick={() =>
                setopenChat((prev) => ({
                  ...prev,
                  // isOpen: !prev.isOpen,
                  isOpen: true,
                  contactUserData: {...prev.contactUserData,...user}
                }))
              }
              className="flex items-center p-4 hover:bg-gray-700 cursor-pointer"
            >
              {/* Circle Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-600 flex-shrink-0"></div>
              {/* Chat Info */}
              <div className="ml-4 flex-grow border-b border-gray-700 pb-4">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-white">{user.name}</h2>
                  <span className="text-sm text-gray-400">6:45 PM</span>
                </div>
                <p className="text-gray-400">Last message...</p>
              </div>
            </div>
          ))}

          {/* Repeat Chat Item as needed */}
          {/* ... */}
        </div>
      </div>
    </div>
  );
};

export default main;
