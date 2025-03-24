
import userDefaultImage from "@/assets/userDefaultImage.jpeg";
import toast, { Toast } from "react-hot-toast";
import { useSocket } from "@/context/socket";

interface customFriendRequestToastProps {
    t: Toast;
    sender: {
        name: string;
        email: string;
        profilePicture?: string;
    };
    reciver: {
        email: string;
    };
}
const CustomFriendRequestToast = ({t,sender,reciver}:customFriendRequestToastProps) => {
    const {socket}=useSocket();
  return (
              <div
                className={`${
                  t.visible ? "animate-enter" : "animate-leave"
                } max-w-md w-full bg-white shadow-lg rounded-full pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
              >
                <div className="flex-1 w-0 p-4 flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={
                        sender?.profilePicture
                          ? sender?.profilePicture
                          : userDefaultImage
                      }
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
                      socket?.emit(
                        "freindRequestAccepted",
                        sender?.email,
                        reciver?.email
                      );
                    }}
                    className="bg-indigo-600 text-white w-fit h-fit p-2  rounded-lg  text-sm hover:bg-indigo-500 focus:outline-none"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => {
                      // Handle decline logic
                      socket?.emit(
                        "friendRequestDeclined",
                        sender?.email,
                        reciver?.email
                      );
                    }}
                    className="bg-red-600 text-white w-fit h-fit p-2  rounded-lg   text-sm hover:bg-red-500 focus:outline-none"
                  >
                    Decline
                  </button>
                </div>
              </div>
  )
}

export default CustomFriendRequestToast