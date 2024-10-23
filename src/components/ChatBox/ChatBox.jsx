import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { userData } from "../../userData";
import api from "../../api";
import { Button } from "../ui/button";
import EmojiPicker from "emoji-picker-react";
import TypingIndicator from "./TypingIndicator";
import Chat from "./Chat";
import { useUser } from "@/context/UserContext";
import { Toaster ,toast} from "react-hot-toast";

const socket = io("http://localhost:5000");

const ChatBox = ({ openChat }) => {
  const {data,setUserData,notification,setnotification}=useUser();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ShowTyping, setShowTyping] = useState(false);
  const typingTimeoutRef = useRef(null); // For tracking typing timeout
  const chatEndRef = useRef(null);
  
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(true)
  
  const contactUserData = openChat.contactUserData;
  let contactUserId = openChat.contactUserData?._id;


  
  
  console.log("chat",chat);
  
  useEffect(() => {
    const fetchUserData = async () => {

        const Data = await userData();
        setUserData(Data);  // Set data after fetching
      
    };
    fetchUserData();
}, []);

  useEffect(() => {
    if(data){
        socket.emit("setup",data);     
      setloading(false);
    }
  }, [data])
  

  useEffect(() => {
    socket.on("notify", ({ message, currentUserId ,socketUserName}) => {
      if (contactUserId) {
        console.log("contact " + contactUserId + " current " + currentUserId);
      }
      console.log(notification);
      
      // Checking if the notification is not for the current chat
      if (!contactUserId || (contactUserId !== currentUserId && contactUserId !== 'undefined')) {
        // alert(`notification: ${message}`);
        setnotification((prev)=>[...prev,message]);
        
        toast.success(`${socketUserName+':' +message}`,{autoClose: false});
        
        console.log("received notification:", message);
      }
    });
  
    return () => {
      socket.off("notify");
    };
  }, [contactUserId]); // <-- Add contactUserId to dependency array
  


// Infinite scroll 
// const chatBoxRef = useRef(null);
// const handleInfinityScroll = async () => {
  //   if (chatBoxRef.current) {
    //     console.log(chatBoxRef.current.scrollTop);  // Use the ref to access chatBox
//     if(chatBoxRef.current.scrollTop==100){
  //       setTimeout(() => {
//         setpage(prev=>prev+1);

//       }, 1000);
//     }
//   }
// };

// useEffect(() => {
  //   const chatbox = chatBoxRef.current;
  
  //   if (chatbox) {
    //     chatbox.addEventListener("scroll", handleInfinityScroll);
//     return () => chatbox.removeEventListener("scroll", handleInfinityScroll);
//   }
// }, [contactUserId]);


useEffect(() => {
  const fetchMessages = async () => {
    try {
      if (contactUserId) {
        const response = await api.get(`/chat/${contactUserId}?page=${page}`, {
          withCredentials: true,
        });
        let newData= response.data.data;
        newData.reverse();     
        setChat((prev)=>[...newData]);
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

  fetchMessages();
}, [contactUserId,page])


// New useEffect to handle room joining and socket events after data is updated
useEffect(() => {
  if (data && contactUserId) {

      const currentUserId = data._id;
      const roomId = [currentUserId, contactUserId].sort().join("_");

      socket.emit("join-room", { roomId, userId: currentUserId });

      socket.on("receiveMessage", ({ roomId: receivedRoomId, message, selectedImage, currentUserId, contactUserId }) => {
        // console.log(` room id ${roomId}, message, img  ${selectedImage}, currentuserid ${this.currentUserId}, contactusrid ${this.contactUserId} `);
        const senderId = data._id;
     const reciverId  = contactUserData._id;
        const activeRoomId = [senderId,reciverId].sort().join("_");        
      
        if (receivedRoomId === activeRoomId) {
          setChat((prevChat) => [
            ...prevChat,
            {
              content: message,
              image: selectedImage,
              sender: currentUserId,
              recipient: contactUserId,
              createdAt: new Date(),
            },
          ]);
        }
      });
      
      

      socket.on("Typing", (roomId,currentUserId) => {
        const activeRoomId = [data._id, contactUserId].sort().join("_");
        
        if (currentUserId !== data._id && roomId === activeRoomId) {
          setShowTyping(true);
        }
      });
      
      socket.on("typing-stop", () => {
        setShowTyping(false);
      });
      
      socket.on('typing-stop', () => {
        setShowTyping(false);
      });

      // Handle notification for new message
 
  }

  return () => {
    socket.off("receiveMessage");
    socket.off("Typing");
    socket.off("typing-stop");
  };
}, [data, contactUserId]);


  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => {
    scrollToBottom();
  }, [chat]);

  const sendMessage = async () => {
    if ((message || selectedImage) && contactUserId) {
     
      const currentUserId = data._id;
      const roomId = [currentUserId, contactUserId].sort().join("_");
      console.log(roomId);

      console.log(message);

      socket.emit("sendMessage", {
        roomId,
        message,
        selectedImage,
        currentUserId,
        contactUserId,
      });
      setMessage("");
    }
  };

  if (!openChat.isOpen) {

    return (
      <div className="w-2/3 h-auto flex justify-center items-center text-black text-8xl">
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
      };
      reader.readAsDataURL(file); // Read the file as a Data URL
    }
  };

  // Function to remove selected image
  const removeImage = () => {
    setSelectedImage(null);
  };

  const handleImageSend = () => {
    sendMessage();
    removeImage();
  };

  const onEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji);
  };

  
  const SendTypingIndegator= async ()=>{    
    const currentUserId = data._id;
    console.log(currentUserId);
    const roomId = [currentUserId, contactUserId].sort().join("_");
  socket.emit("Typing-indicator",roomId,currentUserId);
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  }
  
  // Hide typing indicator after 3 seconds of no typing
  typingTimeoutRef.current = setTimeout(() => {
    socket.emit('Stop-typing',roomId);
    setShowTyping(false); // Stop showing "Typing..." after 3 seconds
  }, 1000); 
  }


if(loading){
  return <div>loading... ho rha hai
    <div><Toaster/></div>
  </div>
  
}   

  return (
    <>

    {ShowTyping && <div className="absolute left-[60%]  bottom-24 "><TypingIndicator/> </div>}
      
      {selectedImage && (
        <div className="fixed w-screen h-screen  z-10">
          <div
            className="fixed w-auto h-auto max-h-[600px] max-w-[700px] z-10 top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2  z-100 
            rounded-2xl bg-gray-700"
          >
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
                <div className="flex mt-5 mb-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="bg-transparent text-white w-full outline-none"
                    placeholder="Add a Caption...."
                  />
                  <Button
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleImageSend}
                  >
                    Send{" "}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex flex-col w-2/3 h-full bg-gray-900 text-white ">
        {/* Top NavBar */}
        <div><Toaster/></div>
        <div className="flex items-center justify-between  p-4 bg-gray-800">
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-lg bg-gray-700">
              <i className="fas fa-arrow-left"></i>
            </button>
            <div className="flex flex-col">
              <h2 className="text-lg font-bold">{contactUserData.name}</h2>
              <span className="text-sm text-gray-400">
                last seen at 6:46 PM
              </span>
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
        <div
        // ref={chatBoxRef} 
          id="chatBox"
          className="flex-grow p-4   bg-gray-900 overflow-y-auto"
        >
           {/* chats here  */}
          <Chat  chat={chat} contactUserId={contactUserId}/>
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Section */}

        <div className="flex items-center p-4 bg-gray-800">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowEmojiPicker(!ShowEmojiPicker)}
              className="p-2 text-gray-400 hover:text-white"
            >
             {!ShowEmojiPicker ? <i className="far fa-smile text-3xl"></i>: <i class="fa-solid fa-xmark text-3xl "></i>}</button>
            {ShowEmojiPicker && (
              <div  className="absolute top-1/2   left-1/2 -translate-x-1/2 -translate-y-1/2">
                
                <EmojiPicker theme="dark" width={700} onEmojiClick={onEmojiClick} />
              </div>
            )}
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
            onChange={(e) => {
              setMessage(e.target.value);
              SendTypingIndegator();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 mx-4 focus:outline-none h-auto"
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
