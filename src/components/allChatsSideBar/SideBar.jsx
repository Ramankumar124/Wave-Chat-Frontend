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
      
      <div id="mainChat" className="w-full h-full flex flex-col items">
        <div
          id="topBar"
          className=" p-3 px-8 text-white flex justify-between text-2xl font-bold "
        >
          <p>Chats</p>
          <div className="flex gap-4">
           
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
              <div className="w-12 h-12 relative rounded-full bg-gray-600 flex-shrink-0">
                <img className="w-full h-full rounded-full object-cover "  
               src={user?.profilePicture?user?.profilePicture:userDefaultImage}
                
                alt="user image" />
            { user.isOnline &&   <div className="absolute right-0 top-0 bg-green-500 h-3 w-3 rounded-full "></div>
  }            </div>
              {/* Chat Info */}
              <div className="ml-4 flex-grow border-b border-gray-700 pb-4">
                <div className="flex justify-between">
                  <h2 className="font-semibold text-white">{user.name}</h2>
                  <span className="text-sm text-gray-400">6:45 PM</span>
                </div>
                <p className="text-gray-400"></p>
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
