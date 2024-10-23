import { createContext,useContext,useState} from 'react'

const UserContext=createContext();


export const UserProvider=({children})=>{

    const [data, setdata] = useState(null);
    const [notification, setnotification] = useState([])
    const setUserData=(user)=>{
        setdata(user);
    }

    return <UserContext.Provider value={{data,setUserData,notification,setnotification}}>
        {children}
    </UserContext.Provider>
}
export  const useUser=()=>{
    return  useContext(UserContext);
}

