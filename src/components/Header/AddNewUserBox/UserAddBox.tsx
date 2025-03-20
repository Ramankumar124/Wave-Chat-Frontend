import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import api from "@/api";
import { useUser } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";
import userDefaultImage from "@/assets/userDefaultImage.jpeg";
import { useSocket } from "@/context/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setUserData } from "@/redux/features/authSlice";


interface User{
_id:string,
name:string,
contacts:User,
email:string,

}

const UserAddBox = () => {
  const [users, setusers] = useState([]);
  const [Filteredusers, setFilteredusers] = useState([]);
  const [isopen, setisopen] = useState(false);
  const data=useSelector((state:RootState)=>state.auth.user)
  const dispatch=useDispatch();
  // const { 
  //   data, setUserData
  //  } = useUser();
const {socket}=useSocket();

  useEffect(() => {
    if (data && data?.contacts?.length === 0) {
      console.log("Contacts are empty, opening dialog...");
      setisopen(true);
      ShowAllUsers();
    }
  }, [data]) 

  const ShowAllUsers = async () => {
    console.log(data);

    try {
      const response = await api.get("/get-all-users");
      console.log("all user list Data is ", response);

      if (response && data) {
        // Combine both conditions in a single filter
        const suggestedUsers = response.data.filter((user) => {
          // Check if the user's name or _id exists in data.contacts and exclude them
          const isNameInContacts = data.contacts.some(
            (contact) => contact.email === user.email
          );
          const isIdMatching = user._id === data._id;

          // Return true only if neither condition is met
          return !isNameInContacts && !isIdMatching;
        });
        if (suggestedUsers) {
          setusers(suggestedUsers);
          setFilteredusers(suggestedUsers);
          console.log(users);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  function sendFriendRequest(user:User) {
    console.log(data);
     const senderEmail=data.email
     const reciverEmail=user.email
    console.log("reciver email",reciverEmail);
    if (socket) {
      socket.emit("SendFreindRequest",  senderEmail, reciverEmail);
      toast.success(` Friend Request Sended to ${user.name}`);
    }
  }

  function handleInputSearch(e) {
    const searchQuery = e.target.value.toLowerCase();
    const newFilteredUsers = users.filter((user) =>
      user.name.toLowerCase().startsWith(searchQuery)
    );
    setFilteredusers(newFilteredUsers); // Update the filtered list
  }




  useEffect(() => {
    if (socket) {
      socket.on("IncomingfriendRequest", ({sender, reciver}) => {
 console.log("friend Request sender",sender ,reciver);
 
        // console.log(reciver);

        // alert(`${sender?.name} sended u friend request`);
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-enter" : "animate-leave"
              } max-w-md w-full bg-white shadow-lg rounded-full pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4 flex items-center">
                <div className="flex-shrink-0">
                  <img
                    className="h-12 w-12 rounded-full"
                    src={sender.profilePicture?sender.profilePicture:userDefaultImage}
                    alt="User avatar"
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-semibold text-gray-900">
                    {sender.name}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    wants to be your friend
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 pr-4 items-center justify-normal">
                <button
                  onClick={() => {
                    // Handle accept logic

                    toast.dismiss(t.id);
                    socket.emit("freindRequestAccepted",sender?.email, reciver?.email);
                  }}
                  className="bg-indigo-600 text-white w-fit h-fit p-2  rounded-lg  text-sm hover:bg-indigo-500 focus:outline-none"
                >
                  Accept
                </button>
                <button
                  onClick={() => {
                    // Handle decline logic
                    socket.emit("friendRequestDeclined",sender?.email,reciver?.email);
                  }}
                  className="bg-red-600 text-white w-fit h-fit p-2  rounded-lg   text-sm hover:bg-red-500 focus:outline-none"
                >
                  Decline
                </button>
              </div>
            </div>
          ),
          { duration: Infinity }
        );
      });
     
      

      socket.on("FriendRequestSended", (senderChanges) => {
        try {
        if (!data || !data.friendRequest) {''
          console.error("Error: 'data' or 'data.friendRequest' is undefined.");
          return; // Exit the handler early if data is not properly initialized
        }
        // Create a new copy of the data object with updated friendRequest.sent
        const newData = {
          ...data, // Copy the existing data
          friendRequest: {
            ...data.friendRequest, // Copy the existing friendRequest
            sent: senderChanges,   // Update the sent property
          },
        };
        dispatch(setUserData(newData));
        // setUserData(newData);
          
      } catch (error) {
        console.error("Error updating user data:", error);
      }
 }     );

 socket.on("AcceptedFriendRequest", (userContactsChanges) => {
  try {
    const newData={
      ...data,
      contacts:userContactsChanges
    }
    dispatch(setUserData(newData));

    // setUserData(newData);
    ShowAllUsers();
  } catch (error) {
    console.error("Error updating user data:", error); 
  }
});

    }
    return ()=>{
      if(socket){
        socket.off("IncomingfriendRequest");
        socket.off("FriendRequestSended");
        socket.off("AcceptedFriendRequest");
    }}
  }, [socket,data]);


 useEffect(() => {
      console.log("data changed",data);
      
      }, [data])
  return (
    <div>
      {(isopen && data?.contacts.length==0) &&
      <div className="fixed z-50 left-1/2 top-[10%] -translate-x-1/2 flex flex-col items-center w-full">
       <p className="text-x2l   md:text-4xl"> Welcome To Wave Chat</p>
       <p className="text-xl md:text-2xl">Add Users To Your Conctact</p>
      </div>}
      <Toaster />
      <Dialog open={isopen} onOpenChange={setisopen} >
        <DialogTrigger onClick={()=>{
          ShowAllUsers(); // Fetch users on trigger click
          setisopen(true);
        }} >
          <i className="fa-solid fa-plus md:text-4xl text-xl"></i>
        </DialogTrigger>
        <VisuallyHidden>
          <DialogTitle>Hidden Dialog Title</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="md:w-[500px]  w-[80%] h-auto max-h-[300px] md:max-h-[600px] flex flex-col items-center bg-base-200 text-base-content">
          <h1>Find People</h1>

          <Input
            onChange={(e) => handleInputSearch(e)}
            type="text"
            placeholder="Find and add someone"
          />
          <div className="All Users List flex flex-col py-2 w-[80%]  md:w-full  md:px-8 p-2 overflow-y-scroll">
            {Filteredusers.length > 0 ? (
              Filteredusers.map((user:User) => {
                const isPending = data.friendRequest.sent.some(
                  (sentUser) => sentUser.email === user.email
                );

                return (
                  <div
                    className="w-full h-10 flex items-center justify-between gap-2"
                    key={user._id}
                  >
                    <div className="user-image bg-gray-400 w-8 h-8 rounded-full">
                      <img
                        className="w-full h-full rounded-full object-cover  "
                        src={
                          user?.profilePicture
                            ? user?.profilePicture
                            : userDefaultImage
                        }
                        alt="user image"
                      />
                    </div>
                    <p className="md:text-xl text-sm font-light">{user.name}</p>
                    <button
                      onClick={() => sendFriendRequest(user)}
                      disabled={isPending}
                      className={`md:h-7 md:w-24 p-1 text-xs text-white rounded-full md:text-md font-bold py-1 flex items-center justify-center ${
                        isPending ? "bg-red-600" : "bg-blue-600"
                      }`}
                    >
                      {isPending ? "Pending" : "Add"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-gray-500">No users found</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserAddBox;
