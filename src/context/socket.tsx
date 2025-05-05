import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

// Define the type for the context
interface SocketContextType {
  socket: Socket | null;
  isConneted:boolean
}

const SocketContext = createContext<SocketContextType | null>(null);

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
      setisConneted(true);
    });

    socketInstance.on("disconnect", () => {
      setisConneted(false);
    });

    
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
