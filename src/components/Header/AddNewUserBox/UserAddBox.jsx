import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import api from "@/api";
import { useUser } from "@/context/UserContext";
import toast, { Toaster } from "react-hot-toast";

const UserAddBox = () => {
  const [users, setusers] = useState([]);
  const [Filteredusers, setFilteredusers] = useState([]);

  const { data,setUserData, newSocket } = useUser();
  
  
  
 
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

  function sendFriendRequest(user) {
    console.log(data);

    console.log(user.name);
    if (newSocket) {
      newSocket.emit("SendFreindRequest", { sender: data, reciver: user });
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

  if (newSocket) {
    newSocket.on("IncomingfriendRequest", (sender,reciver) => {
      console.log(reciver);
      
      // alert(`${sender?.name} sended u friend request`);
      toast.custom((t) => (
        <div
          className={`${
            t.visible ? "animate-enter" : "animate-leave"
          } max-w-md w-full bg-white shadow-lg rounded-full pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4 flex items-center">
            <div className="flex-shrink-0">
              <img
                className="h-12 w-12 rounded-full"
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
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
                newSocket.emit('freindRequestAccepted',sender,reciver);
              }}
              className="bg-indigo-600 text-white w-fit h-fit p-2  rounded-lg  text-sm hover:bg-indigo-500 focus:outline-none"
            >
              Accept
            </button>
            <button
              onClick={() => {
                // Handle decline logic
                toast.dismiss(t.id);
              }}
              className="bg-red-600 text-white w-fit h-fit p-2  rounded-lg   text-sm hover:bg-red-500 focus:outline-none"
            >
              Decline
            </button>
          </div>
        </div>
      ),{duration:Infinity});
    });

    newSocket.on("FriendRequestSended",(updatedUser)=>{
      setUserData(updatedUser)
      console.log("updatedUser",updatedUser);

    })

    newSocket.on('AcceptedFriendRequest',(updatedUserData)=>{
      setUserData(updatedUserData);
      ShowAllUsers();
    })
  }

}, [newSocket])


  return (
    <div>
      <Toaster />
      <Dialog onOpenChange={() => console.log("hey")}>
        <DialogTrigger onClick={ShowAllUsers}>
          <i class="fa-solid fa-plus"></i>
        </DialogTrigger>
        <VisuallyHidden>
          <DialogTitle>Hidden Dialog Title</DialogTitle>
        </VisuallyHidden>
        <DialogContent className="w-[400px] h-[600px] flex flex-col items-center">
          <h1>Find People</h1>

          <Input onChange={(e)=>handleInputSearch(e)}   type="text" placeholder="Find and add someone"  />
          <div className="All Users List flex flex-col py-2 w-full px-8 overflow-visible">
  {Filteredusers.length > 0 ? (
    Filteredusers.map((user) => {
      const isPending = data.friendRequest.sent.some(
        (sentUser) => sentUser.email === user.email
      );

      return (
        <div
          className="w-full h-10 flex items-center justify-between"
          key={user._id}
        >
          <div className="user-image bg-gray-400 w-8 h-8 rounded-full"></div>
          <p className="text-xl font-light">{user.name}</p>
          <button
            onClick={() => sendFriendRequest(user)}
            disabled={isPending}
            className={`h-7 w-24 text-white rounded-full text-md font-bold py-1 flex items-center justify-center ${
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
