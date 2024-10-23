import React, { useEffect, useRef } from "react";
import { useUser } from "@/context/UserContext";
import NotificationSound from "../../assets/NotificationSound.mp3";
const Header = () => {
  const { notification } = useUser();
  const audioPlayer = useRef(null);

  useEffect(() => {
    function playAudio() {
      audioPlayer.current.play();
      
    }
  }, [notification]);

  return (
    <div className=" bg-slate-500 w-full h-[5%] text-white text-3xl">
      {notification.length}
      <audio ref={audioPlayer}  src={NotificationSound}></audio>
    </div>
  );
};

export default Header;
