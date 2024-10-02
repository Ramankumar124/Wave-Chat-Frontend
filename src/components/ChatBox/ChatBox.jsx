import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { userData } from "../../userData";
import api from "../../api";
import { Button } from "../ui/button";

const socket = io("http://localhost:5000"); 

const ChatBox = ({ openChat }) => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const chatEndRef = useRef(null);
  const ChatuserData = openChat.ChatuserData;

  let contactUserId = openChat.ChatuserData?._id;

  useEffect(() => {
    const fetchUserData = async () => {
      if (contactUserId) {
        const data = await userData();
        const currentUserId = data._id;
        const roomId = [currentUserId, contactUserId].sort().join("_");

        socket.emit("join-room", { roomId, userId: currentUserId });
      }
    };
    const fetchMessages = async () => {
      try {
        if (contactUserId) {
          const response = await api.get(`/chat/${contactUserId}`, {
            withCredentials: true,
          });

          setChat(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.log("No chat found");

          setChat([]);
        } else {
          console.log("Error: ", error.message);
          setChat([]);
        }
      }
    };

    fetchUserData();
    fetchMessages();

    // Listen for new messages
    socket.on(
      "receiveMessage",
      ({ roomId, message, currentUserId, contactUserId }) => {
        console.log(selectedImage);
        
        setChat((prevChat) => [
          ...prevChat, // Spread previous messages
          {
            content: message,
            sender: currentUserId,
            recipient: contactUserId,
            createdAt: new Date(),
          }, // New message
        ]);
      }
    );

    return () => {
      socket.off("receiveMessage");
    };
  }, [contactUserId]);


  
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if (message && contactUserId) {
      const data = await userData();
      const currentUserId = data._id;
      const roomId = [currentUserId, contactUserId].sort().join("_");
      console.log(roomId);

      console.log(message);

      socket.emit("sendMessage", {
        roomId,
        message,
        // selectedImage,
        currentUserId,
        contactUserId,
      });
      setMessage("");
    }
  };

  if (!openChat.isOpen) {
    return (
      <div className="w-2/3 h-full flex justify-center items-center text-black text-8xl">
        Select a chat to start messaging
      </div>
    );
  }
  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };


  // Function to handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result); // Set the image data as base64 string
        console.log(reader.result);
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
      
    }
  };

  // Function to remove selected image
  const removeImage = () => {
    setSelectedImage(null);
  };

  

  return (
    <>
         { selectedImage && (<div className="fixed w-auto h-auto max-h-[600px] max-w-[700px] z-10 top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2  z-100 
            rounded-2xl bg-gray-700">
              {selectedImage && (
                
        <div className=" w-full h-full px-16">
          <div className="flex my-5 items-center justify-start gap-6 ">
            <button
            onClick={removeImage}
            className="  text-gray-300  text-6xl  w-6 h-6 flex items-center justify-center"
          >
            &times;
          </button>
          <h2 className="text-white text-3xl font-bold">Send Image</h2>
          </div>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-auto h-auto object-center   object-cover"
          />
          <div className="flex mt-5 mb-2" >
          <input type="text" className="bg-transparent text-white w-full outline-none" placeholder="Add a Caption...." />
          <Button className="bg-blue-600 hover:bg-blue-700">Send </Button>
          </div>
        
        </div>
      )}
            </div>)}

    <div className="flex flex-col w-2/3 h-screen bg-gray-900 text-white ">
      {/* Top NavBar */}
      <div className="flex items-center justify-between  p-4 bg-gray-800">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-gray-700">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">{ChatuserData.name}</h2>
            <span className="text-sm text-gray-400">last seen at 6:46 PM</span>
          </div>
        </div>

        {/* Search bar and 3-dot menu */}
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-gray-700">
            <i className="fas fa-search"></i>
          </button>
          <button className="p-2 rounded-lg bg-gray-700">
            <i className="fas fa-ellipsis-v"></i>
          </button>
        </div>
      </div>    



      {/* Chat Body */}
      <div id="chatBox" className="flex-grow p-4   bg-gray-900 overflow-y-auto">
        {chat.map((msg, idx) => {
          const createdAtDate = new Date(msg.createdAt);

          const time = !isNaN(createdAtDate.getTime())
            ? createdAtDate.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })
            : "Invalid Date";

          return (
            <div
              key={idx}
              id="outer-msg-box"
              className={`${
                msg.recipient === contactUserId
                  ? "flex justify-end"
                  : "flex justify-start"
              }`}
            >
              {msg.sender === contactUserId ? (
                <div className="m-5 p-4 relative text-xl text-white h-auto   max-w-[200px] bg-[#474545] rounded-lg">
                  {msg.content}
                  <div className="w-full text-xs flex items-end justify-end absolute text-gray-200 right-2 bottom-0">
                    {time}
                  </div>
                </div>
              ) : (
                <div className="m-5 p-4 relative text-xl text-white h-auto  max-w-[200px] bg-[#2d7d4a] rounded-lg">
                  {msg.content}
                  <div className="w-full text-xs flex items-end justify-end absolute text-gray-200 right-2 bottom-0">
                    {time}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatEndRef} />
      </div>



      {/* Bottom Input Section */}
      
      <div className="flex items-center p-4 bg-gray-800">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white">
            <i className="far fa-smile"></i>
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <div className="flex items-center justify-center">
              <label className="cursor-pointer">
                <i className="fas fa-camera text-3xl text-gray-500 hover:text-blue-500"></i>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageChange}
                />
             
              </label>
     
            </div>
          </button>
         
        </div>
        
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message"
          className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 mx-4 focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="bg-green-500 p-3 rounded-full hover:bg-green-600"
        >
          <i className="fas fa-paper-plane"></i>
        </button>
      </div>
      
    </div>
    </>
  );
};

export default ChatBox;
