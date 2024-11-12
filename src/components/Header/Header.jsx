import React, { useEffect, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import NotificationSound from "../../assets/NotificationSound.mp3";
import Call from "../Call/Call";
import { toast, Toaster } from "react-hot-toast";
import { messaging } from "@/firebase";
import { getToken } from "firebase/messaging";
const Header = () => {


  async function requestPermission() {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      // Generate Token
   const token=await  getToken(messaging,{vapidKey:"BApqSCZ8GP01NlRztqshlwYKnKW-HoRPFVMtVismbf4DaoqmusYlDAwXKUwJIiizpWS1Nf6LKgH36bRm9rgeEV8"})
      console.log("Token Gen", token);
      // Send this token  to server ( db)
    } else if (permission === "denied") {
      alert("You denied for the notification");
    }
  }

  useEffect(() => {
    // Req user for notification permission
    requestPermission();
  }, []);



  const { notification, newSocket,toggleCallBox,setToggleCallBox,  stream,setstream,isCallActive, setIsCallActive
  } = useUser();
  const audioPlayer = useRef(null);
  const [incomingCall, setIncomingCall] = useState(false); // State to control popup visibility
  const [data, setdata] = useState();

  useEffect(() => {
    function playAudio() {
      audioPlayer.current.play();
    }
    if (notification.length > 0) playAudio();
  }, [notification]);

  useEffect(() => {
    if (newSocket) {
      // Define event listeners
      const handleIncomingCall = (data) => {
        setIncomingCall(true);
        setdata(data);
      };
  
      const handleCallRejected =  async () => {
        location.reload();
        console.log("call declined");
        setIncomingCall(false);
        setToggleCallBox(false);
        stopMediaStream();
      };
  
      // Attach event listeners
      newSocket.on("incomming-call", handleIncomingCall);
      newSocket.on("call-rejected", handleCallRejected);
  
      // Cleanup function to remove listeners on unmount or dependency change
      return () => {
        newSocket.off("incomming-call", handleIncomingCall);
        newSocket.off("call-rejected", handleCallRejected);
      };
    }
  }, [newSocket]);

  const handleAnswerCall = () => {
    console.log("data header", data);
    setIncomingCall(false); // Hide popup after answering
    setToggleCallBox(true);
    // Add your answer call logic here
    console.log(stream);
    
  };

  const handleRejectCall =  () => {
    newSocket.emit("call-declined", data._id);
    setIncomingCall(false); // Hide popup after answering
  };

  const stopMediaStream = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setstream(null);
    }
  };

  
  return (
    <div className="bg-slate-500 w-full h-[5%] text-white text-3xl">
      {notification.length}
      <div>
        <Toaster />
      </div>
      {newSocket && newSocket.id}
      {(toggleCallBox &&   !isCallActive) && <Call socket={newSocket} />} {/* Incoming Call Popup */}
      {incomingCall && (
        <div className="fixed top-5 left-1/2 transform -translate-x-1/2 p-4  bg-[#363F48] text-white rounded-xl shadow-lg text-center">
          <div className="w-full h-1/2 flex items-center gap-3">
            <div className="imagecontainer w-12 h-12 rounded-full bg-yellow-400">
              {/* <img src="" alt="" /> */}
            </div>
            <div className="flex flex-col items-start">
              <p className="text-2xl font-bold">{data.name}</p>
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
    </div>
  );
};

export default Header;
