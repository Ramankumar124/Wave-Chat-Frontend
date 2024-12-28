import React, { useEffect, useState } from 'react'
import Sidebar from '../components/allChatsSideBar/SideBar'
import ChatBox from '../components/ChatBox/ChatBox'
import Cookies from 'js-cookie'
import {useNavigate} from 'react-router-dom'
import Header from './Header/Header'
const Home = () => {




  const navigate=useNavigate()
  useEffect(() => {
    
    const token=Cookies.get('token');
    if(!token){
      navigate('/')
      
    }
    }, [])  
  return (
    <div className='w-screen h-screen'>
    <Header/>
      <div className='flex w-full h-[95%]'>  
          <Sidebar  />
         <div className='w-2 h-full '>
           {/* <div className='w-1 h-full rounded-md bg-primary'></div> */}

          </div>
          <ChatBox />
          </div>

    </div>
  )
}

export default Home