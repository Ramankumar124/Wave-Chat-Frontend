
import React, { useEffect } from 'react';
import api from '../../api'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom'
import Cookies from 'js-cookie'
import {toast,Toaster} from  'react-hot-toast'
import { auth, googleProvider } from '@/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';


const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setemail] = useState('');

  useEffect(() => {
    
  const token=Cookies.get('token');
  if(token){
    navigate('/home')
    
  }
  }, [])
  
const navigate=useNavigate()
  const handleSubmit=async  (e)=>{
 e.preventDefault();
 try{

   let response =await api.post('auth/login',{password,email});
   if(response.status===200){
     toast.success("Login Successful"); 
     
     navigate('/home')
    }
  }
  catch(error){
    console.log(error);
    
    toast.error("Wrong Credential");
  }
     
    
  }

  const handleGoogleLogin=async ()=>{
   try {
    const result = await signInWithPopup(auth, googleProvider)
    console.log(result);
    let response=await api.post('auth/googleLogin',{data:result});
    console.log(response);
    
    if(response.status==200){
      navigate('/home');
    }
   } catch (error) {
    console.log(error);
    
   }
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is signed in:", user.email);
    } else {
      console.log("User is signed out.");
    }
  });
  
  const logout=async ()=>{
    try {
      await signOut(auth);
      console.log("User successfully logged out.");
      // Redirect the user to the login page or home
      
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }
  
  return (
    <div className="flex items-center justify-center w-screen min-h-screen bg-gray-100">
      <div><Toaster/></div>
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit} >
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              onChange={(e)=>setemail(e.target.value)}
              className=" w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">password</label>
            <input
            onChange={(e)=>setPassword(e.target.value)}
              type="password"
              // minLength='8'
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Login
          </button>

        </form>
        <div className='bg-gray-400 w-[100px] h-10'>
          <button onClick={handleGoogleLogin}> Google </button>
        </div>
          <button onClick={logout}>logout</button>
        <div className="mt-4 text-center">
          <p>
            Don't have an account?{' '}
            <a href="/register" className="text-blue-500 hover:underline">
              Register
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
