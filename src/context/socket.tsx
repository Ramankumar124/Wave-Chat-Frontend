import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the context
interface SocketContextType {
  socket: Socket | null;
  isConneted:boolean
}

// Create a context with the correct type
const SocketContext = createContext<SocketContextType | null>(null);

// Provider for managing Socket.IO connection
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConneted, setisConneted] = useState(false);
  useEffect(() => {
  
    const SOCKET_URL =import.meta.env.VITE_WSS_API_URL|| 'http://localhost:5000'

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"], 
    });

    setSocket(socketInstance);
    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
      setisConneted(true);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket.IO disconnected");
      setisConneted(false);
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket ,isConneted}}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
