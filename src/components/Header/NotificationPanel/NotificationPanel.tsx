import { useUser } from "@/context/UserContext";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {RootState} from "@/redux/store/store"
import { setNotification, setOpenChat } from "@/redux/features/chatSlice";
const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const { data,notification ,setopenChat,setnotification} = useUser();
  const data=useSelector((state:RootState)=>state.auth.user);
  const {notifications,openChat}=useSelector((state:RootState)=>state.Chat)
  const dispatch=useDispatch()
  // console.log(notifications);


  useEffect(() => {
    // Fetch notifications from localStorage on component mount
    const storedNotifications = localStorage.getItem("notifications");
    if (storedNotifications) {
      // dispatch(storedNotifications)
      // setnotification(JSON.parse(storedNotifications));
    }
  }, []); // Empty dependency array ensures this runs only once on mount
  
  useEffect(() => {
    // Update localStorage whenever notifications change
    localStorage.setItem("notifications", JSON.stringify(notifications));
    // console.log(notifications);
    
  }, [notifications]); // Dependency array with notification ensures this runs when notification changes
  
  // Group notifications by date
  const groupedNotifications = notifications.reduce((acc, curr) => {
    const notificationDate = new Date(curr.messageTime);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    // Determine label (Today, Yesterday, or formatted date)
    let label;
    if (notificationDate.toDateString() === today.toDateString()) {
      label = "Today";
    } else if (notificationDate.toDateString() === yesterday.toDateString()) {
      label = "Yesterday";
    } else {
      label = notificationDate.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    }

    if (!acc[label]) acc[label] = [];
    acc[label].push(curr);

    return acc;
  }, {});


 function openChatFromNotification(userId){
  //  console.log(userId);
  
   data?.contacts.map((contact)=>{
     if(contact._id===userId){
      dispatch(setOpenChat({isOpen:true,contactUserData:contact}))
      //  setopenChat({isOpen:true,contactUserData:contact})
     }
   })

   const newNotification=notifications.filter((item)=>item.userId!=userId)
  dispatch(setNotification(newNotification))
  //  setnotification(newNotification);
   setIsOpen(false)
   
 }

 
  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <div
        className="cursor-pointer "
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className=" fa-solid fa-bell text-xl md:text-3xl"></i>
        {/* Notification Count */}
        <span className="absolute  top-1  left-2 md:top-0 md:left-3 bg-red-500 text-white h-4 w-4 text-[10px] md:w-5 md:h-5 font-bold flex items-center justify-center rounded-full">
          {notifications?.length}
        </span>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="fixed left-10 md:absolute  md:right-0 md:-left-64  mt-2 w-80 bg-black text-white rounded-lg shadow-lg z-10 ">
          <div className=" flex  justify-between items-center p-4 border-b border-gray-700">
            <h3 className="font-semibold">Notifications</h3>
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="p-4 space-y-4 overflow-y-scroll max-h-96">
  {Object.keys(groupedNotifications).map((label, dateIndex) => (
    <div key={dateIndex}>
      {/* Date Header */}
      <div className="text-gray-400 text-sm mb-2">{label}</div>
      <div className="space-y-2">
        {/* Notifications under each label */}
        {groupedNotifications[label].map((item, index) => (
          <div
          onClick={()=>openChatFromNotification(item.userId)}
            key={index}
            className="p-2 bg-gray-800  rounded-lg flex justify-between items-start "
          >
            <div>
              <p className="text-lg">{item.title}</p>
              <p className="text-gray-400 text-lg">{item.message}</p>
            </div>
            <span className="text-gray-400 text-xs">
              {new Date(item.messageTime).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>
        ))}
      </div>
    </div>
  ))}
</div>

         
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;
