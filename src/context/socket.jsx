import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

// Create a context
const SocketContext = createContext();

// Provider for managing Socket.IO connection
export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Initialize the socket connection

    const SOCKET_URL =import.meta.env.VITE_WSS_API_URL|| 'http://localhost:5000'

    const socketInstance = io(SOCKET_URL, {
      transports: ["websocket"], // Optional: Force WebSocket transport
    });

    setSocket(socketInstance);

    // Log connection and disconnection events
    socketInstance.on("connect", () => {
      console.log("Socket.IO connected:", socketInstance.id);
    });

    socketInstance.on("disconnect", () => {
      console.log("Socket.IO disconnected");
    });

    // Cleanup on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
