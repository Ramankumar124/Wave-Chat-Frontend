import { createContext, useContext, useState } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [data, setdata] = useState(null);
  const [notification, setnotification] = useState([]);
  const [openChat, setopenChat] = useState({
    isOpen: false,
    contactUserData: {},
  });

  // const [newSocket, setnewSocket] = useState(null);
  const [toggleCallBox, setToggleCallBox] = useState(false);
  const [stream, setstream] = useState();
  const [isCallActive, setIsCallActive] = useState(false);
const [theme, setTheme] = useState("coffee");

  const setUserData = (user) => {
    setdata(user);
  };

  return (
    <UserContext.Provider
      value={{
        data,
        setUserData,
        notification,
        setnotification,
        openChat,
        setopenChat,
        // newSocket,
        // setnewSocket,
        toggleCallBox,
        setToggleCallBox,
        stream,
        setstream,
        isCallActive, 
        setIsCallActive,
        theme,
        setTheme
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
export const useUser = () => {
  return useContext(UserContext);
};
