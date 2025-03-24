import React, { useEffect, useRef, useState } from "react";
import Peer from "peerjs";

const VoiceCall = ({ socket, contactUserId }) => {
  const [isMuted, setIsMuted] = useState(false);
  const localAudioRef = useRef(null);
  const remoteAudioRef = useRef(null);
  const myPeer = useRef(null);
  const [callEnded, setCallEnded] = useState(false);

  useEffect(() => {
    myPeer.current = new Peer(undefined, {
      host: "localhost",
      port: 9000,
      path: "/myapp",
    });

    // Get local audio stream
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      localAudioRef.current.srcObject = stream;

      myPeer.current.on("call", (call) => {
        // Answer the call with our audio stream
        call.answer(stream);

        // Listen for the remote audio stream
        call.on("stream", (remoteStream) => {
          remoteAudioRef.current.srcObject = remoteStream;
        });
      });
    });

    myPeer.current.on("open", (id) => {
      const roomId = "voiceRoom123";
      socket.emit("join-voice-room", contactUserId, roomId, id);
    });

    socket.on("start-voice-call", (userPeerId) => {
      startVoiceCall(userPeerId);
    });

    return () => {
      myPeer.current?.destroy();
    };
  }, []);

  const startVoiceCall = (userId) => {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then((stream) => {
      const call = myPeer.current.call(userId, stream);
      call.on("stream", (remoteStream) => {
        remoteAudioRef.current.srcObject = remoteStream;
      });
    });
  };

  const toggleMute = () => {
    const audioTrack = localAudioRef.current.srcObject.getAudioTracks()[0];
    if ("start-voi      audioTrack.enabled = !audioTrack.enabled;
      setIsMuted(!audioTrack.enabled);
    }
  };

  const endCall = () => {
    setCallEnded(true);
    socket.emit("end-voice-call");
    if (remoteAudioRef.current.srcObject) {
      remoteAudioRef.current.srcObject = null;
    }
  };

  return (
    <div className=" fixed w-8 h-8 bg-gray-500  voice-call-container">
      <audio ref={localAudioRef} autoPlay muted />
      <audio ref={remoteAudioRef} autoPlay />
      <div>
        <button onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </button>
        <button onClick={endCall}>End Call</button>
      </div>
      {callEnded && <p>Call has ended</p>}
    </div>
  );
};

export default VoiceCall;
