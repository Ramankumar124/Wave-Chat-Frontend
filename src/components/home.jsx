import React, { useEffect, useState } from 'react'
import Sidebar from '../components/allChatsSideBar/SideBar'
import ChatBox from '../components/ChatBox/ChatBox'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
const Home = () => {


  const [openChat, setopenChat] = useState(false)
  const navigate=useNavigate()
  useEffect(() => {
    
    const token=Cookies.get('token');
    if(!token){
      navigate('/')
      
    }
    }, [])  
  return (
    <div className='w-screen h-screen flex'>
    <Sidebar setopenChat={setopenChat} openChat={openChat} />
          <ChatBox openChat={openChat}/>
    </div>
  )
}

export default Home