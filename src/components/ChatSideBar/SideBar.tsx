import React, { useEffect, useState } from "react";
import userDefaultImage from "@/assets/userDefaultImage.jpeg";
import { useSocket } from "@/context/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setOpenChat } from "@/redux/features/chatSlice";
interface contact {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  isOnline: boolean;
  avatar: {
    public_id: string;
    url: string;
    _id: string;
  };
  firebaseToken: string;
  createdAt:Date
}
const main:React.FC = () => {
  const [Contacts, setContacts] = useState<contact[]>([]);
  const {loader,user} = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const { socket } = useSocket();
  const data=user;
  useEffect(() => {
    
    if (!loader && data?.contacts) {
      //@ts-ignorets
      setContacts(data.contacts);
    }    
  }, [data]);
  useEffect(() => {
    if (socket) {
      socket.on("Online-Users", (onlineUser: any) => {
        // Update the Contacts state with online status
        setContacts((prevContacts) =>
          prevContacts.map((contact) => ({
            ...contact,
            isOnline: onlineUser.some(
              (user: any) => user.email === contact.email
            ),
          }))
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("Online-Users");
      }
    };
  }, [socket, data]);

  return (
    <div className="lg:w-1/3 h-full w-[20%] flex border-gray-500 bg-base-300   ">
      <div id="mainChat" className="w-full h-full flex flex-col items">
        <div
          id="topBar"
          className=" lg:p-3 lg:px-8  flex justify-between text-2xl font-bold "
        >
          <p className="lg:text-lg text-sm p-2 ml-3 ">Chats</p>
          <div className="flex gap-4"></div>
        </div>
        <div className="flex-grow overflow-y-auto">
          {Contacts?.map((user: contact) => (
            <div
              key={user._id}
              onClick={() =>
                dispatch(setOpenChat({ isOpen: true, contactUserData: user }))
              }
              className="flex items-center p-4  cursor-pointer"
            >
              <div className="lg:w-14 lg:h-14 w-12 h-12 relative rounded-full flex-shrink-0  items-center justify-center mb-2">
                <img
                  className="w-full h-full rounded-full object-cover  "
                  src={user?.avatar.url}
                  alt="user image"
                />
                {user.isOnline && (
                  <div className="absolute right-0 top-0 bg-green-500 h-3 w-3 rounded-full "></div>
                )}
                <div className="text-xs  text-center md:hidden">
                  {user.name}
                </div>
              </div>
              {/* Chat Info */}
              <div className="ml-4 flex-grow border-b border-gray-700 pb-4 md:block hidden">
                <div className="flex justify-between">
                  <div>
                    <h2 className="font-semibold text-xl">{user.name}</h2>
                    <p className="text-zinc-500 text-lg">
                      {user.isOnline ? "Online" : "Offline"}{" "}
                    </p>
                  </div>
                </div>
                <p className=""></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default main;
