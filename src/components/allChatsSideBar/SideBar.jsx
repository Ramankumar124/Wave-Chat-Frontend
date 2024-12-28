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


const main = () => {
  const [Contacts, setContacts] = useState([]);
  const {openChat,setopenChat,newSocket,data,setUserData}=useUser();

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
  if (newSocket) {
    newSocket.on("Online-Users", (onlineUser) => {
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
    if (newSocket) {
      newSocket.off("Online-Users");
    }
  };
}, [newSocket,data]);



  return (
    <div className="w-1/3 h-full  flex border-gray-500 bg-base-300 ">
      
      <div id="mainChat" className="w-full h-full flex flex-col items">
        <div
          id="topBar"
          className=" p-3 px-8  flex justify-between text-2xl font-bold "
        >
          <p>Chats</p>
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
              <div className="w-14 h-14 relative rounded-full flex-shrink-0  items-center justify-center mb-2">
                <img className="w-full h-full rounded-full object-cover  "  
               src={user?.profilePicture?user?.profilePicture:userDefaultImage}
                
                alt="user image" />
            { user.isOnline &&   <div className="absolute right-0 top-0 bg-green-500 h-3 w-3 rounded-full "></div>
  }            </div>
              {/* Chat Info */}
              <div className="ml-4 flex-grow border-b border-gray-700 pb-4">
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
