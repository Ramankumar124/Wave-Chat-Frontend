
import './App.css'
import Sidebar from './components/allChatsSideBar/SideBar'
import ChatBox from './components/ChatBox/ChatBox'
function App() {


  return (
    <>
      <div className='w-screen h-screen flex'>
      <Sidebar/>
      <ChatBox/>
      </div>
    </>
  )
}

export default App
