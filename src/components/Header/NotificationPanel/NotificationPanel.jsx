import { useUser } from "@/context/UserContext";
import React, { useState } from "react";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data,notification ,setopenChat,setnotification} = useUser();
  console.log(notification);

  // Group notifications by date
  const groupedNotifications = notification.reduce((acc, curr) => {
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
   data.contacts.map((contact)=>{
     if(contact._id===userId){
       setopenChat({isOpen:true,contactUserData:contact})
     }
   })

   const newNotification=notification.filter((item)=>item.userId!=userId)
   setnotification(newNotification);
   setIsOpen(false)
   
 }

 
  return (
    <div className="relative">
      {/* Notification Bell Icon */}
      <div
        className="cursor-pointer text-xl"
        onClick={() => setIsOpen(!isOpen)}
      >
        <i className="text-3xl fa-solid fa-bell"></i>
        {/* Notification Count */}
        <span className="absolute top-0 left-3 bg-red-500 text-white text-xs w-5 h-5 font-bold flex items-center justify-center rounded-full">
          {notification.length}
        </span>
      </div>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-black text-white rounded-lg shadow-lg z-10">
          <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h3 className="font-semibold">Notifications</h3>
            <button
              className="text-gray-400 hover:text-gray-200"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
          </div>
          <div className="p-4 space-y-4">
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
            className="p-2 bg-gray-800 rounded-lg flex justify-between items-start"
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
