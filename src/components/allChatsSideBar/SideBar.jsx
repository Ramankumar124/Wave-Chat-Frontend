import React, { useEffect, useState } from "react";
import { userData } from "@/userData";
import api from '@/api'
import Cookies from 'js-cookie'
import { io } from "socket.io-client";
import { useUser } from "@/context/UserContext";
import userDefaultImage from "@/assets/userDefaultImage.jpeg";



import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSocket } from "@/context/socket";


const main = () => {
  const [Contacts, setContacts] = useState([]);
  const {openChat,setopenChat,data,setUserData}=useUser();
  const {socket}=useSocket();
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await userData();
        // console.log(data);
        if(data) {
        setContacts(data.contacts);
        setUserData(data);
      }
   
        
      } catch (error) {
        console.log("Error fetching user data:", error);
      }
    };
  
    fetchUserData();
  }, []);
useEffect(() => {
 if(data) {
  setContacts(data.contacts);
  setUserData(data);
  console.log("User data",data);
  
}
}, [data])

useEffect(() => {
  if (socket) {
    socket.on("Online-Users", (onlineUser) => {
      // console.log("Online users:", onlineUser);

      // Update the Contacts state with online status
      setContacts((prevContacts) =>
        prevContacts.map((contact) => ({
          ...contact,
          isOnline: onlineUser.some((user) => user.email === contact.email),
        }))
      );
    });
  }

  // Clean up the socket listener when the component unmounts
  return () => {
    if (socket) {
      socket.off("Online-Users");
    }
  };
}, [socket,data]);



  return (
    <div className="lg:w-1/3 h-full w-[20%] flex border-gray-500 bg-base-300   ">
      
      <div id="mainChat" className="w-full h-full flex flex-col items">
        <div
          id="topBar"
          className=" lg:p-3 lg:px-8  flex justify-between text-2xl font-bold "
        >
          <p className="lg:text-lg text-sm p-2 ml-3 ">Chats</p>
          <div className="flex gap-4">
           
          

          </div>
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
              className="flex items-center p-4  cursor-pointer"
            >
              {/* Circle Avatar */}
              <div className="lg:w-14 lg:h-14 w-12 h-12 relative rounded-full flex-shrink-0  items-center justify-center mb-2">
                <img className="w-full h-full rounded-full object-cover  "  
               src={user?.profilePicture?user?.profilePicture:userDefaultImage}
                
                alt="user image" />
            { user.isOnline &&   <div className="absolute right-0 top-0 bg-green-500 h-3 w-3 rounded-full "></div>
          
  }            <div className="text-xs  text-center md:hidden">{user.name}</div>
   </div>
              {/* Chat Info */}
              <div className="ml-4 flex-grow border-b border-gray-700 pb-4 md:block hidden">
                <div className="flex justify-between">
         
                  <div>
                  <h2 className="font-semibold text-xl">{user.name}</h2>
                  <p className="text-zinc-500 text-lg">{user.isOnline?"Online":"Offline" } </p>
                  </div>
                  {/* <span className="text-sm ">6:45 PM</span> */}
                </div>
                <p className=""></p>
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
