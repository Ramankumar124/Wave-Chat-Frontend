import React, { useEffect } from 'react';
import api from '../../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, Toaster } from 'react-hot-toast';
import { auth, googleProvider } from '@/firebase';
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth';

import googleIcon from '../../assets/googleicon.png';

const Login = () => {
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      navigate('/home');
    }
  }, []);

  // const validateInputs = () => {
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //   if (!email || !emailRegex.test(email)) {
  //     toast.error('Please enter a valid email address.');
  //     return false;
  //   }

  //   if (!password || password.length < 8) {
  //     toast.error('Password must be at least 8 characters long.');
  //     return false;
  //   }

  //   return true;
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // if (!validateInputs()) {
    //   return;
    // }

    try {
      let response = await api.post('auth/login', { password, email });
      if (response.status === 200) {
        toast.success('Login Successful');
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
      toast.error('Wrong Credentials');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      console.log(result);
      let response = await api.post('auth/googleLogin', { data: result });
      console.log(response);

      if (response.status === 200) {
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
    }
  };

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('User is signed in:', user.email);
    } else {
      console.log('User is signed out.');
    }
  });

  const logout = async () => {
    try {
      await signOut(auth);
      console.log('User successfully logged out.');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="flex login-container items-center justify-center w-screen min-h-screen bg-gray-100 text-black md:bg-[length:125%_125%]">
      <div>
        <Toaster />
      </div>
      <div className="w-[80%] max-w-md p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center font-mono">Wave Chat</h1>
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring text-black focus:text-black focus:ring-opacity-50 focus:ring-blue-400 bg-white"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring focus:ring-opacity-50 focus:ring-blue-400 bg-white"
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

        <div className="bg-white rounded-md border-2 border-gray-200 text-black h-10 mt-2">
          <button onClick={handleGoogleLogin} className="flex w-96 items-center justify-center">
            <img className="w-8 h-8 flex items-center justify-center" src={googleIcon} alt="" />
            <p className="text-lg">Sign in With Google</p>
          </button>
        </div>

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
