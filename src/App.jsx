
import './App.css'
import Login from './components/authPages./loginpage'
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Register from './components/authPages./RegisPage'
import Home from './components/home'
import { useEffect } from 'react'
import { onMessage } from 'firebase/messaging'
import { messaging } from './firebase'
import { useUser } from './context/UserContext'

function App() {
const {theme,setTheme} = useUser();
useEffect(() => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/firebase-messaging-sw.js')
      .then(function(registration) {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch(function(error) {
        console.log('Service Worker registration failed:', error);
      });
  }
  

},[])

useEffect(() => {
  onMessage(messaging, (payload) => {
    console.log("Message received in foreground:", payload);
    // Optionally show a toast or custom notification here
  });
}, []);

useEffect(() => {
  const localTheme = localStorage.getItem('theme');
  if (localTheme) {
    setTheme(localTheme);
  }

}, [])

  return (
    <>
    <Router>
      <div data-theme={theme} className='App'>
        <Routes>
        <Route path='/' element={<Login/>}/>
          <Route path='/login' element={<Login/>}/>
          <Route path='/register' element={<Register/>}/>
          <Route path='/home' element={<Home/>} />
        </Routes>
      </div>
    </Router>
       
   
    </>
  )
}

export default App
   