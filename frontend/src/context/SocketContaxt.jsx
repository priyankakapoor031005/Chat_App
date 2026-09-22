// import React, { createContext, useContext, useEffect, useState } from "react";
// import io from "socket.io-client";
// import { useAuth } from "./AuthContext";

// const SocketContext = createContext();

// export const useSocketContext = () => {
//   return useContext(SocketContext);
// };

// export const SocketContextProvider = ({ children }) => {
//   const [socket, setSocket] = useState(null);
//   const [onlineUser, setOnlineUser] = useState([]);
//   const { authUser } = useAuth();

//   useEffect(() => {
//     // If there's no auth user, don't connect
//     if (!authUser) {
//       if (socket) {
//         socket.disconnect();
//         setSocket(null);
//       }
//       return;
//     }

//     const newSocket = io("http://localhost:3000", {
//       query: { userId: authUser._id },
//     });

//     newSocket.on("getOnlineUsers", (users) => {
//       setOnlineUser(users);
//     });

//     setSocket(newSocket);

//     // Cleanup on unmount or user change
//     return () => {
//       newSocket.disconnect();
//     };
//   }, [authUser]);

//   return (
//     <SocketContext.Provider value={{ socket, onlineUser }}>
//       {children}
//     </SocketContext.Provider>
//   );
// };
// SocketContextProvider.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext"; // Ensure your AuthContext exports authUser

// Create Context
const SocketContext = createContext();

// Custom hook to use context
export const useSocketContext = () => useContext(SocketContext);

// Provider component
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser?._id) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
      return;
    }

    // Connect to backend at port 3000
    const newSocket = io("http://localhost:3000", {
      query: {
        userId: authUser._id,
      },
      withCredentials: true, // optional
    });

    // Log connection
    newSocket.on("connect", () => {
      console.log("✅ Connected to socket server:", newSocket.id);
    });

    // Handle online users
    newSocket.on("getOnlineUsers", (users) => {
      console.log("📡 Online users:", users);
      setOnlineUser(users);
    });

    // Handle connection error
    newSocket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
      setSocket(null);
    };
  }, [authUser]);

  return (
    <SocketContext.Provider value={{ socket, onlineUser }}>
      {children}
    </SocketContext.Provider>
  );
};
