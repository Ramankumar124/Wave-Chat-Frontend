import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Peer from "peerjs";
import { Toaster, toast } from "react-hot-toast";
import Resizable from "react-resizable-box";
import { useSocket } from "@/context/socket";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";
import { setStream } from "@/redux/features/applSlice";
const Call = ({ receiverId }:{receiverId:string}) => {

  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setisMuted] = useState<boolean>(false);
 const {socket}=useSocket();
  const vedioRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const dispatch=useDispatch();
  const data=useSelector((state:RootState)=>state.auth.user);
  const stream=useSelector((state:RootState)=>state.app.stream);
  const myPeer = useRef<Peer | null>(null);
  const fetchUserFeed = async () => {
    const stream =
    await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true, // Set to true if you want to share audio as well
    })
    dispatch(setStream(stream))
        if (vedioRef.current) {
          vedioRef.current.srcObject = stream;
        }
      
    
  };
  const toggleMute=()=>{
    if(stream){
      const audioTrack=stream.getAudioTracks()[0];
      if(audioTrack){
        audioTrack.enabled=!audioTrack.enabled;
        setisMuted(!audioTrack.enabled);
      }
    }
  };
  useEffect(() => {
    myPeer.current = new Peer("", {
      host: "wavechat-perjs-server.onrender.com",
      secure: true,
      port: 443,
      // host: "localhost",
      // secure: false,
      // port:9000,
      path: "/myapp",
    });
    fetchUserFeed();

    myPeer.current.on("open", (id:string) => {
      const roomId ="Room@123";
      socket?.emit("join-call-room", receiverId, roomId, id, data);
    });
    socket?.on("start-call", (userPeerId) => {
    
      callUser(userPeerId);
    });
    myPeer.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          if (vedioRef.current) {
            vedioRef.current.srcObject = stream;
          }
          call.on("stream", (userVideoStream) => {
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = userVideoStream;
            }
          });
        });
    });
  }, []);

  const callUser = (userId:string) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {

        if (vedioRef.current) {
          vedioRef.current.srcObject = stream;
        }
        if (myPeer.current) {
          const call = myPeer.current.call(userId, stream);

          call.on("stream", (userVideoStream) => {
            if (peerVideoRef.current) {
              peerVideoRef.current.srcObject = userVideoStream;
              setcallText("");
            }
          });
        }
      });
  };
  const EndCall = () => {
    const roomId = "Room@123"; // Example room ID
    socket?.emit("call-Ended", roomId);
  };
  socket?.on("send-call-ended", () => {
    setCallEnded(true);
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = null;
    }
    location.reload();
    setTimeout(() => {
      location.reload();
    }, 5000);
  });
  return (
    //@ts-ignore
    <Resizable>
     
      <div className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] h-[60%] md:w-[800px] md:h-[800px] flex bg-gray-600 ">
        <Toaster />
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 right-0 w-[150px] h-[150px] md:w-[250px] md:h-[250px]  flex  items-center justify-center rounded-lg ">
            <video
              className="flex object-cover border-2   border-green-500 md:w-[250px] md:h-[250px] "
              ref={vedioRef}
              style={{  borderRadius: "50px" }}
              muted
              autoPlay
            ></video>
          </div>
          <div className=" w-full h-full bg-slate-600">
            <video
              className="flex object-cover"
              ref={peerVideoRef}
              style={{ width: "100%", height: "100%" }}
           
              autoPlay
            ></video> 
          </div>
        
          <div className="absolute bottom-9 right-1/2 ml-9">
            <button
              onClick={EndCall}
              className="bg-red-500 p-3 rounded-full hover:scale-110 rotate-45  animate-in"
            >
              <i className="rotate-90 tex-4xl fa-solid fa-phone text-white"></i>
            </button>
          </div>

          <div className="absolute top-1/2 right-1/2 lg-translate-x-1/2 -translate-y-1/2  text-white">
            {callEnded && <p className="text-4xl"> Call Is Ended Now </p>}
          </div>
          <div className="absolute bottom-9 left-[10%] md:left-[30%]  ">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full w-10 h-10 bg-green-500 hover:bg-opacity-80 text-white`}
              >
                {isMuted ? 
                <i className="fa-solid fa-microphone-slash"></i>
                : <i className="fa-solid fa-microphone"></i>}
              </button>


          
            </div>
        </div>
      </div>
      </Resizable>
  );
};

export default Call;
