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
import Call from "../Call/Call";
import messageSoundBubble from "../../assets/messageSoundBubble.mp3"
import userDefaultImage from "@/assets/userDefaultImage.jpeg";
import ContactProfile from "./ContactProfile";
import WebsiteLogo from "../../assets/website logo.png";
import VoiceCall from "../Call/VoiceCall";

const socket = io("http://localhost:5000");

const ChatBox = () => {
  const {data,setUserData,notification,setnotification,openChat,newSocket,setnewSocket,toggleCallBox,setToggleCallBox,isCallActive, setIsCallActive}=useUser();
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [ShowEmojiPicker, setShowEmojiPicker] = useState(false);
  const [ShowTyping, setShowTyping] = useState(false);
  const typingTimeoutRef = useRef(null); // For tracking typing timeout
  const chatEndRef = useRef(null);
  // const [toggleCallBox,setToggleCallBox]=useState(false);
  const [page, setpage] = useState(1);
  const [loading, setloading] = useState(true)
  
  
  const contactUserData = openChat.contactUserData;
  let contactUserId = openChat.contactUserData?._id;

  const  audioPlayer=useRef();
  setnewSocket(socket);
  
  
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
        socket.emit("setup",({data,OrignalSocketId:socket.id}));     
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
        let newNotification = {
          message,
          messageTime: new Date(),
           title: socketUserName,
            userId: currentUserId,
          
        }
        setnotification((prev)=>[...prev,newNotification]);
        
        toast.success(`${socketUserName+':' +message}`,{autoClose: false});
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 pt-0.5">
                  <img
                    className="h-10 w-10 rounded-full"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixqx=6GHAjsWpt9&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                    alt=""
                  />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                  {socketUserName}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                 {message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        ))
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
      
      socket.on("soundpopup",()=>{
           
        audioPlayer.current.play();
      })

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
    console.log("send message");
    
    if ((message || selectedImage) && contactUserId) {
     
      const currentUserId = data._id;
      const roomId = [currentUserId, contactUserId].sort().join("_");
      console.log(roomId);

      console.log(message);
      console.log("fb token",contactUserData.firebaseToken
      );
      
      const reciverName=contactUserData.name;
      console.log(reciverName);
      
   const reciverFBToken=contactUserData.firebaseToken;
      socket.emit("sendMessage", {
        roomId,
        message,
        selectedImage,
        currentUserId,
        contactUserId,
        reciverFBToken,
        reciverName
      });
      setMessage("");
    }
  };

  if (!openChat.isOpen) {

    return (
      <div className="w-[80%] h-auto flex justify-center items-center text-black text-8xl">
       <div className="items-center justify-center flex flex-col text-base-content gap-3">
          <img className="md:w-60  w-40" src={WebsiteLogo} alt="website logo" />
          <h2 className="md:text-4xl text-2xl font-bold ">Welcome To WaveChat!</h2>
          <p className="md:text-lg text-sm text-center">Select a conversation from the sidebar to start hatting</p>
          </div>
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


  // socket.on('incomming-call',()=>{
  //   alert("call a rhi hai");
  // })
  const handleStartCall=()=>{
    setIsCallActive(true);
    setToggleCallBox(true);
  }

if(loading){
  return <div>loading... ho rha hai
    <div><Toaster/></div>
  </div>
  
}   
const currentUserId = data._id;
const roomId = [currentUserId, contactUserId].sort().join("_");

  return (
    <>
    {toggleCallBox && <Call socket={socket} contactUserId={contactUserId}/>}
    {ShowTyping && <div className="absolute left-[60%]  bottom-24 "><TypingIndicator/> </div>}
      <audio src={messageSoundBubble} ref={audioPlayer} ></audio>
      {selectedImage && (
        <div className="fixed w-screen h-screen  z-10">
          <div
            className="fixed w-auto h-auto max-h-[600px] max-w-[700px] z-10 top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2  z-100 
            rounded-2xl bg-gray-700"
          >
            {selectedImage && (
              <div className=" w-full h-full min-w-80 md:px-16 px-4">
                <div className="flex my-5 items-center justify-start gap-6 ">
                  <button
                    onClick={removeImage}
                    className="  text-gray-300  md:text-6xl text-2xl w-6 h-6 flex items-center justify-center"
                  >
                    &times;
                  </button>
                  <h2 className="text-base-content md:text-3xl t font-bold">Send Image</h2>
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

      <div className="flex flex-col w-[80%] lg:w-2/3 h-full bg-base-200   ">
        {/* Top NavBar */}
        <div><Toaster/></div>
        <div className="flex items-center justify-between  p-4 ">
          <div className="flex items-center space-x-4">
             <div  className="md:w-12 md:h-12 w-8 h-8  rounded-full  flex-shrink-0">
        <ContactProfile className='relative' contactUserData={contactUserData}/>
                            
                 </div>
            <div className="flex flex-col">
              <h2 className="md:text-lg text-sm font-bold">{contactUserData.name}</h2>
              <span className="text-sm text-green-500 h-2 w-7">
                {ShowTyping && "Typing...."}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button onClick={handleStartCall} className="p-2 rounded-lg ">
            <i class="fa-solid fa-video"></i>
                        </button>
           
            {/* <VoiceCall socket={socket} contactUserId={contactUserId} /> */}
          </div>
        </div>

        {/* Chat Body */}
        <div
        // ref={chatBoxRef} 
          id="chatBox"
          className="flex-grow md:p-4  bg-base-100 overflow-y-auto"
        >
           {/* chats here  */}
          <Chat  chat={chat} contactUserId={contactUserId}/>
          <div ref={chatEndRef} />
        </div>

        {/* Bottom Input Section */}

        <div className="flex items-center p-4 bg-base-300 rounded-sm  border-base-300  border-t-2">
          <div className="flex items-center lg:space-x-4">
            <button
              onClick={() => setShowEmojiPicker(!ShowEmojiPicker)}
              className="p-2 text-primary "
            >
             {!ShowEmojiPicker ? <i className="far fa-smile lg:text-3xl text-xl"></i>: <i class="fa-solid fa-xmark text-3xl "></i>}</button>
            {ShowEmojiPicker && (
              <div  className="absolute top-1/2   left-1/2 -translate-x-1/2 -translate-y-1/2">
                
                <EmojiPicker theme="dark"  onEmojiClick={onEmojiClick} />
              </div>
            )}
            <button className="lg:p-2 p-1 ">
              <div className="flex items-center text-primary justify-center">
                <label className="cursor-pointer">
                  <i className="fas fa-camera lg:text-3xl text-xl "></i>
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
            className="flex-grow bg-base-200  input input-bordered text-base-content rounded-lg lg:px-4 lg:py-2 mx-4 focus:outline-none h-auto w-40"
          />
          <button
            onClick={sendMessage}
            className="bg-primary lg:p-3 rounded-full text-base-300  text-sm  lg:text-lg p-1 "
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ChatBox;
