import React, { useEffect, useState } from "react";
import { useRef } from "react";
import Peer from "peerjs";
import { useUser } from "@/context/UserContext";
import Draggable from "react-draggable";
import { Toaster, toast } from "react-hot-toast";
import Resizable from "react-resizable-box";
const Call = ({ socket, contactUserId }) => {
  const [user, setuser] = useState();
  const { data, stream, setstream } = useUser();
  const [callEnded, setCallEnded] = useState(false);
  const [isMuted, setisMuted] = useState()

  const vedioRef = useRef(null);
  const peerVideoRef = useRef(null);

  const myPeer = useRef(null);
  const fetchUserFeed = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });

    setstream(stream);
    
    vedioRef.current.srcObject = stream;
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
    myPeer.current = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });
    // console.log("new peer",newPeer);
    console.log(socket);

    fetchUserFeed();

    myPeer.current.on("open", (id) => {
      // socket.emit('start-call',id,roomId);
      const roomId = "room123"; // Example room ID
      socket.emit("join-call-room", contactUserId, roomId, id, data);
    });
    socket.on("start-call", (userPeerId) => {
      console.log("user is caliing", userPeerId);
      callUser(userPeerId);
    });
    myPeer.current.on("call", (call) => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          call.answer(stream);
          vedioRef.current.srcObject = stream;

          call.on("stream", (userVideoStream) => {
            peerVideoRef.current.srcObject = userVideoStream;
          });
        });
    });
  }, []);

  const callUser = (userId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        vedioRef.current.srcObject = stream;
        const call = myPeer.current.call(userId, stream);

        call.on("stream", (userVideoStream) => {
          peerVideoRef.current.srcObject = userVideoStream;
        });
      });
  };
  const EndCall = () => {
    const roomId = "room123"; // Example room ID
    socket.emit("call-Ended", roomId);
  };

  socket.on("send-call-ended", () => {
    // alert("call ended");
    // toast('Call Ended!', {
    //   icon: '👏',
    // });
    setCallEnded(true);
    peerVideoRef.current.srcObject = null;
    // location.reload();
    setTimeout(() => {
      location.reload();
    }, 5000);
  });
  return (
    <Resizable>
    <Draggable>
     
      <div className="z-50 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] flex bg-gray-600 ">
        <Toaster />
        <div className="relative w-full h-full">
          <div className="absolute bottom-0 right-0 w-[250px] h-[250px]  flex  items-center justify-center rounded-lg ">
            <video
              className="flex object-cover border-2 border-green-500"
              ref={vedioRef}
              style={{ width: "250px", height: "250px", borderRadius: "50px" }}
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
          <div className="absolute bottom-9 right-1/2">
            <button
              onClick={EndCall}
              className="bg-red-500 p-3 rounded-full hover:scale-110 rotate-45  animate-in"
            >
              <i class="rotate-90 tex-4xl fa-solid fa-phone text-white"></i>
            </button>
          </div>

          <div className="absolute top-1/2 right-1/2 -translate-x-1/2 -translate-y-1/2  text-white">
            {callEnded && <p> Call Is Ended Now </p>}
          </div>
          <div className="absolute bottom-9 left-[30%]  ">
              <button
                onClick={toggleMute}
                className={`p-2 rounded-full w-10 h-10 bg-green-500 hover:bg-opacity-80`}
              >
                {isMuted ? 
                <i class="fa-solid fa-microphone-slash"></i>
                : <i class="fa-solid fa-microphone"></i>}
              </button>
            </div>
        </div>
      </div>
    </Draggable>
      </Resizable>
  );
};

export default Call;
