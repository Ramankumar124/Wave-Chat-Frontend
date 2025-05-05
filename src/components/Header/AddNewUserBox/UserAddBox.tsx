import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import toast, { Toaster } from "react-hot-toast";
import userDefaultImage from "@/assets/userDefaultImage.jpeg";
import { useSocket } from "@/context/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setUserData } from "@/redux/features/authSlice";
import { useLazyGetAllUsersQuery } from "@/redux/api/apiSlice";
import { User } from "@/redux/features/authSlice";
import CustomFriendRequestToast from "@/components/utils/CustomFriendRequestNotificationToast";

const UserAddBox = () => {
  const [users, setusers] = useState([]);
  const [Filteredusers, setFilteredusers] = useState([]);
  const [isopen, setisopen] = useState(false);
  const data = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const [fetchUsers, {}] = useLazyGetAllUsersQuery();

  const { socket } = useSocket();

  useEffect(() => {
    if (data && data?.contacts?.length === 0) {
      setisopen(true);
      ShowAllUsers();
    }
  }, [data]);

  useEffect(() => {
    if (socket) {
      socket.on("IncomingfriendRequest", ({ sender, reciver }) => {
        toast.custom(
          (t) => (
            <CustomFriendRequestToast t={t} sender={sender} reciver={reciver} />
          ),
          { duration: Infinity }
        );
      });

      socket.on("FriendRequestSended", (senderChanges) => {
        try {
          if (!data || !data.friendRequest) {
            console.error(
              "Error: 'data' or 'data.friendRequest' is undefined."
            );
            return;
          }
          const newData = {
            ...data,
            friendRequest: {
              ...data.friendRequest,
              sent: senderChanges,
            },
          };
          dispatch(setUserData(newData));
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      });

      socket.on("AcceptedFriendRequest", (userContactsChanges) => {
        try {
          const newData = {
            ...data,
            contacts: userContactsChanges,
          };
          //@ts-ignore
          dispatch(setUserData(newData));
          ShowAllUsers();
        } catch (error) {
          console.error("Error updating user data:", error);
        }
      });
    }
    return () => {
      if (socket) {
        socket.off("IncomingfriendRequest");
        socket.off("FriendRequestSended");
        socket.off("AcceptedFriendRequest");
      }
    };
  }, [socket, data]);

  const ShowAllUsers = async () => {
    try {
      const response = await fetchUsers(null).unwrap();
      if (response && data) {
        const suggestedUsers = response.filter((user: User) => {
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
        }
      }
    } catch (error: any) {
      toast.error("Unable To fetch All users Data")
      console.log(error?.message);
    }
  };
  function sendFriendRequest(user: User) {
    const senderEmail = data?.email;
    const reciverEmail = user?.email;
    if (socket) {
      socket.emit("SendFreindRequest", senderEmail, reciverEmail);
      toast.success(` Friend Request Sended to ${user?.name}`);
    }
  }

  function handleInputSearch(e: React.ChangeEvent<HTMLInputElement>) {
    const searchQuery = e.target.value.toLowerCase();
    const newFilteredUsers = users.filter((user: User) =>
      user.name.toLowerCase().startsWith(searchQuery)
    );
    setFilteredusers(newFilteredUsers);
  }

  return (
    <div>
      {isopen && data?.contacts.length == 0 && (
        <div className="fixed z-[100] left-1/2 top-[10%] gap-2 -translate-x-1/2 flex flex-col items-center w-full">
          <p className="text-x2l   md:text-5xl"> Welcome To Wave Chat</p>
          <p className="text-xl md:text-3xl">Add Users To Your Conctact</p>
        </div>
      )}
      <Toaster />
      <Dialog open={isopen} onOpenChange={setisopen}>
        <DialogTrigger
          onClick={() => {
            ShowAllUsers(); // Fetch users on trigger click
            setisopen(true);
          }}
        >
          <div className="flex items-center gap-3">
          <i className="fa-solid fa-plus md:text-4xl text-xl"></i>
          <p className="md:hidden">  Add New User</p>
          </div>
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
              Filteredusers.map((user: User) => {
                              //@ts-ignore
                const isPending = data?.friendRequest.sent.some(
                  (sentUser:any) => sentUser.email === user.email
                );
                return (
                  <div
                    className="w-full h-10 flex items-center justify-between gap-2"
                    key={user._id}
                  >
                    <div className="user-image bg-gray-400 w-8 h-8 rounded-full">
                      <img
                        className="w-full h-full rounded-full object-cover  "
                        src={user?.avatar ? user?.avatar.url : userDefaultImage}
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
