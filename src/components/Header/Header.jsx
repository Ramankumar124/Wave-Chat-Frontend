import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import NotificationSound from "../../assets/NotificationSound.mp3";
import Call from "../Call/Call";
import { toast, Toaster } from "react-hot-toast";
import { messaging } from "../../firebase";
import { getToken } from "firebase/messaging";
import api from "@/api";
import UserAddBox from "./AddNewUserBox/UserAddBox";
import NotificationPanel from "./NotificationPanel/NotificationPanel";
import UserProfile from "./UserProfile/UserProfile";
import SettingsPage from "./settingPanel/SettingPage";
import WebsiteLogo from "../../assets/website logo.png";
import { useSocket } from "@/context/socket";

const Header = () => {
  async function requestPermission() {
    const permission = await Notification.requestPermission();

    if (permission === "granted") {
      // Generate Token
      const FBtoken = await getToken(messaging, {
        vapidKey:
          "BApqSCZ8GP01NlRztqshlwYKnKW-HoRPFVMtVismbf4DaoqmusYlDAwXKUwJIiizpWS1Nf6LKgH36bRm9rgeEV8",
      });
      console.log("Token Gen", FBtoken);
      // const email=data.email
      try {
        

        const response = await api.post("/Notification/storeToken", {
          FBtoken,
        });
        console.log(response);
      } catch (error) {
        console.log(error);
      }
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    const cookieValue = localStorage.getItem("token");
    requestPermission();
  }, []);

  const {
    notification,
    toggleCallBox,
    setToggleCallBox,
    data,
    stream,
    setstream,
    isCallActive,
    setIsCallActive,
  } = useUser();
  const audioPlayer = useRef(null);
  const [incomingCall, setIncomingCall] = useState(false); // State to control popup visibility
  const [icomingCalldata, seticomingCalldata] = useState();
  const [toggleNotfication, settoggleNotfication] = useState(false)
 const {socket}=useSocket();

  useEffect(() => {
    function playAudio() {
      audioPlayer.current.play();
    }
    if (notification.length > 0) playAudio();
    console.log("notification ", notification);
  }, [notification]);

  useEffect(() => {
    if (socket) {
      // Define event listeners
      const handleIncomingCall = (icomingCalldata) => {
        setIncomingCall(true);
        seticomingCalldata(icomingCalldata);
      };

      const handleCallRejected = async () => {
        location.reload();
        console.log("call declined");
        setIncomingCall(false);
        setToggleCallBox(false);
        stopMediaStream();
      };

      // Attach event listeners
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
    console.log("icomingCalldata header", icomingCalldata);
    setIncomingCall(false); // Hide popup after answering
    setToggleCallBox(true);
    // Add your answer call logic here
    console.log(stream);
  };

  const handleRejectCall = () => {
    socket.emit("call-declined", icomingCalldata._id);
    setIncomingCall(false); // Hide popup after answering
  };

  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setstream(null);
    }
  };

  
  const handleLogout = async () => {
    console.log("hello");
    try {
        const response = await api.get('/auth/logout'); 
        location.reload(); 
        localStorage.removeItem('token'); 
    } catch (error) {
        console.log("Error during logout:", error);
    }
}
  return (
    <div className="  w-full h-auto bg-base-200  text-3xl flex justify-between items-center">
  
      <img className=" h-16" src={WebsiteLogo} alt="" />
      <div>
        
      </div>
      {toggleCallBox && !isCallActive && <Call socket={socket} />}{" "}
      {/* Incoming Call Popup */}
      {incomingCall && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-4  bg-[#363F48] text-white rounded-xl shadow-lg text-center">
          <div className="w-full h-1/2 flex items-center gap-3">
            <div className="imagecontainer w-12 h-12 rounded-full bg-yellow-400">
              {/* <img src="" alt="" /> */}
            </div>
            <div className="flex flex-col items-start">
              <p className="text-2xl font-bold">{icomingCalldata.name}</p>
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
      <div className=" flex mr-2 md:mr-7 gap-3 md:gap-5">
        <div>
           <UserAddBox/>
        </div>
        <div className="" >
           

          <SettingsPage />
        </div>
        <div>
    
        <NotificationPanel/>
        </div>

        <div>
          <UserProfile/>
        </div>
        <div >
       <button onClick={handleLogout}>
       <i class="fa-solid fa-arrow-right-from-bracket text-xl md:text-3xl"></i>
        </button>
        
        </div>
      </div>
    </div>
  );
};

export default Header;
