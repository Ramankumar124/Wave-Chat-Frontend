import { useEffect ,useState} from "react";
import { io } from "socket.io-client";
import api from '../../api'
const ChatBox = () => {

  const [userData, setuserData] = useState("");
  const [message, setmessage] = useState("");


  const socket = io("http://localhost:5000"); // Connect to Socket.IO server
  
  useEffect(() => {
  
    socket.on("connect", () => {
      console.log("Connected with ID:", socket.id); 
    });
  
    socket.on("disconnect", () => {
      console.log("Disconnected");
    });
  
    return () => socket.disconnect(); // Clean up on unmount
  }, []);

  useEffect(() => {
    
    socket.on("new-message",message=>{
      const p=document.createElement('p');
      p.innerText=message;
     const chatBox= document.getElementById('chatBox');
     chatBox.appendChild(p);
  
    })
    return () => {
      socket.off("new-message"); // Cleanup the event listener
    };
    
  }, [socket])
  
  

  useEffect(()=>{
  api.get('/users')
  .then(response=>{
    setuserData(response.data);
    console.log(response);
    console.log(userData);
    
  })
  },[])

  function sendMessage(){

    console.log(message);
    socket.emit("message",message)
    
  }
  return (
    <div className="flex flex-col w-2/3 h-screen bg-gray-900 text-white">
      
      {/* Top NavBar */}
      <div className="flex items-center justify-between p-4 bg-gray-800">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-lg bg-gray-700">
            <i className="fas fa-arrow-left"></i>
          </button>
          <div className="flex flex-col">
            <h2 className="text-lg font-bold">Golu</h2>
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

      {/* Chat Body (empty for now) */}
      <div id="chatBox" className="flex-grow p-4 bg-gray-900 overflow-y-auto"> 
        <p>{userData.name}</p>
        {/* Add chat messages here */}
      </div>
      
      {/* Bottom Input Section */}
      <div className="flex items-center p-4 bg-gray-800">
        {/* Emoji and Attachment Icon */}
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-white">
            <i className="far fa-smile"></i> {/* Emoji Icon */}
          </button>
          <button className="p-2 text-gray-400 hover:text-white">
            <i className="fas fa-paperclip"></i> {/* Attachment Icon */}
          </button>
        </div>
        
        {/* Input Field */}
        <input
          type="text"
          value={message}
          onChange={e=>setmessage(e.target.value)}
          placeholder="Type a message"
          className="flex-grow bg-gray-700 text-white rounded-lg px-4 py-2 mx-4 focus:outline-none"
        />
        
        {/* Send Button */}
        <button onClick={sendMessage} className="bg-green-500 p-3 rounded-full hover:bg-green-600">
          <i className="fas fa-paper-plane"></i> {/* Send Icon */}
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
