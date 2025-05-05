import { useEffect, useRef, useState } from "react";
import NotificationSound from "../../assets/NotificationSound.mp3";
import Call from "../Call/Call";
import UserAddBox from "./AddNewUserBox/UserAddBox";
import NotificationPanel from "./NotificationPanel/NotificationPanel";
import UserProfile from "./UserProfile/UserProfile";
import SettingsPage from "./settingPanel/SettingPage";
import WebsiteLogo from "../../assets/website logo.png";
import { useSocket } from "@/context/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setStream, setToggleCallBox } from "@/redux/features/applSlice";
import { useLogoutUserMutation } from "@/redux/api/apiSlice";
import { getToken } from "firebase/messaging";
import { messaging } from "@/firebase";
import Api from "@/api";
import toast, { Toaster } from "react-hot-toast";
const Header = () => {
  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
      const FBtoken = await getToken(messaging, {
        vapidKey:
          "BApqSCZ8GP01NlRztqshlwYKnKW-HoRPFVMtVismbf4DaoqmusYlDAwXKUwJIiizpWS1Nf6LKgH36bRm9rgeEV8",
      });
      try {
        const response = await Api.post("/Notification/storeToken", {
          FBtoken,
        });
      } catch (error) {
        toast.error("Firebaes notification Error");
      }
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const notification = useSelector(
    (state: RootState) => state.Chat.notifications
  );
  const audioPlayer = useRef<HTMLAudioElement>(null);
  const [incomingCall, setIncomingCall] = useState(false); // State to control popup visibility
  interface IncomingCallData {
    _id: string;
    name: string;
    // Add other properties if needed
  }

  const [icomingCalldata, seticomingCalldata] =
    useState<IncomingCallData | null>(null);
  const { socket } = useSocket();
  const dispatch = useDispatch();
  const { isCallActive, stream, toggleCallBox } = useSelector(
    (state: RootState) => state.app
  );

  const openChat = useSelector((state: RootState) => state?.Chat?.openChat);
  let receiverId = openChat.contactUserData._id;

  const [logoutUser, { isLoading, isError, error }] = useLogoutUserMutation();

  useEffect(() => {
    function playAudio() {
      if (audioPlayer.current) {
        audioPlayer.current.play();
      }
    }
    if (notification.length > 0) playAudio();
  }, [notification]);

  useEffect(() => {
    if (socket) {
      const handleIncomingCall = (icomingCalldata: any) => {
        setIncomingCall(true);
        seticomingCalldata(icomingCalldata);
      };
      const handleCallRejected = async () => {
        location.reload();
        setIncomingCall(false);
        dispatch(setToggleCallBox(false));
        stopMediaStream();
      };
      socket.on("incomming-call", handleIncomingCall);
      socket.on("call-rejected", handleCallRejected);

      // Cleanup function to remove listeners on unmount or dependency change
      return () => {
        socket.off("incomming-call", handleIncomingCall);
        socket.off("call-rejected", handleCallRejected);
      };
    }
  }, [socket]);

  const handleAnswerCall = () => {
    setIncomingCall(false); // Hide popup after answering
    dispatch(setToggleCallBox(true));
  };

  const handleRejectCall = () => {
    socket?.emit("call-declined", icomingCalldata?._id);
    setIncomingCall(false); // Hide popup after answering
  };

  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      dispatch(setStream(null));
    }
  };

  const handleLogout = async () => {
    await logoutUser(null);
    window.location.reload();
  };
  return (
    <div className="  w-[100%] h-[5%] md:h-[10%] bg-base-200  text-3xl flex justify-between items-center ">
      <Toaster
        toastOptions={{
          // Ensure toasts have unique IDs to prevent duplicates
          id: (id) => id,
          // Limit the number of toasts shown at once
          maxToasts: 3,
          // Prevent duplicate toasts
          duration: 5000,
        }}
      />
      <img className=" md:h-16 h-8" src={WebsiteLogo} alt="" />
      {toggleCallBox && !isCallActive && <Call receiverId={receiverId} />}
      {/* Incoming Call Popup */}
      {incomingCall && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-4  bg-[#363F48] text-white rounded-xl shadow-lg text-center">
          <div className="w-full h-1/2 flex items-center gap-3">
            <div className="imagecontainer w-12 h-12 rounded-full bg-primary-content flex justify-center items-center">
              {/* <img src="" alt="" /> */}
              <p className="text-primary textt-3xl">
                {icomingCalldata?.name[0].toUpperCase()}
              </p>
            </div>
            <div className="flex flex-col items-start">
              <p className="text-2xl font-bold">{icomingCalldata?.name}</p>
              <p className="text-sm font-semibold ml-2">Is now Calling..</p>
            </div>
          </div>

          <button
            onClick={handleAnswerCall}
            className="mt-2 px-4 py-2 mx-1 bg-[#00C3A5] text-white text-sm font-bold rounded"
          >
            Answer
          </button>
          <button
            onClick={handleRejectCall}
            className="mt-2 px-4 py-2  mx-1 bg-red-500 text-white text-sm rounded font-bold"
          >
            Reject
          </button>
        </div>
      )}
      <audio ref={audioPlayer} src={NotificationSound}></audio>
      <div className="flex mr-2 md:mr-7 gap-3 md:gap-5 items-center">
        {/* NotificationPanel always visible */}
        <div>
          <NotificationPanel />
        </div>
        <div className="">
          <SettingsPage />
        </div>
        {/* Desktop view - show all buttons */}
        <div className="hidden md:flex gap-5  ">
          <div>
            <UserAddBox />
          </div>
          <div>
            <UserProfile />
          </div>
          <div>
            <button onClick={handleLogout}>
              <i className="fa-solid fa-arrow-right-from-bracket text-xl md:text-3xl"></i>
            </button>
          </div>
        </div>

        {/* Mobile view - show dropdown */}
        <div className="md:hidden">
          <div className="dropdown dropdown-end">
            <div tabIndex={0} role="button" className="m-1">
              <i className="fa-solid fa-ellipsis-vertical text-xl"></i>
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-[1] menu p-2 shadow bg-base-300  rounded-box w-52"
            >
              <li>
                <div className="w-full flex items-center  ">
                  <UserAddBox />
                </div>
              </li>

              <li>
                <div className="w-full flex items-center">
                  <UserProfile />
                </div>
              </li>
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2"
                >
                  <i className="fa-solid fa-arrow-right-from-bracket"></i>
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
