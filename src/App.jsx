
import './App.css'
import Login from './components/loginpage'
import LoginPage from './components/loginpage'
import {BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import Register from './components/RegisPage'
import Home from './components/home'
function App() {


  return (
    <>
    <Router>
      <div className='App'>
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
