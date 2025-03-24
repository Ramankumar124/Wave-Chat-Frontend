import React, { useState } from 'react'
import { Login } from '../../components/auth/Login';
import { Register1 } from '../../components/auth/Register1';
import { ForgotPassword } from '../../components/auth/ForgotPassword';
import { ResetPassword } from '../../components/auth/ResetPassword';
import Register2 from '@/components/auth/Register2';
import VerifyForgotPassword from '@/components/auth/verfifyForgotPassword';
import OtpVerifyEmail from '@/components/auth/otpVerifyEmail';


type AuthPage = 'login' | 'register1' | 'register2' |'forgot-password' | 'otp' | 'reset-password' | 'dashboard' |'verify-forgot-password' |'otp-verifyEmail';
const AuthLaout = () => {
    const [currentPage, setCurrentPage] = useState<AuthPage>('login');
    const [email, setEmail] = useState('');
   const [localdata, setlocaldata] = useState()
    const handlePageChange = (page: AuthPage, userEmail?: string) => {
      if (userEmail) setEmail(userEmail);
      setCurrentPage(page);
    };
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
         <div className="w-full max-w-6xl bg-gray-800 rounded-2xl shadow-2xl flex overflow-hidden">
        {/* Left Section - Auth Forms */}
        <div className="w-full md:w-1/2 p-8">
          {currentPage === 'login' && <Login onPageChange={handlePageChange} />}
          {currentPage === 'register1' && <Register1 onPageChange={handlePageChange} localdata={localdata} setlocaldata={setlocaldata} />}
          {currentPage === 'register2' && <Register2 onPageChange={handlePageChange} localdata={localdata} setlocaldata={setlocaldata}/>}
          {currentPage === 'forgot-password' && <ForgotPassword onPageChange={handlePageChange} />}
          {currentPage === 'verify-forgot-password' && <VerifyForgotPassword email={email} onPageChange={handlePageChange} />}
          {currentPage === 'reset-password' && <ResetPassword onPageChange={handlePageChange} />}
          {currentPage === 'otp-verifyEmail' && <OtpVerifyEmail onPageChange={handlePageChange} />}

        </div>

        {/* Right Section - Image/Preview */}
        <div className="hidden md:block w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1000"
            alt="Auth Banner"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm flex items-center justify-center">
            <div className="text-center p-8">
              <h2 className="text-4xl font-bold text-white mb-4">Welcome Back To WaveChat!</h2>
              <p className="text-gray-200">Connect, Type, Send.</p>
            </div>
          </div>
        </div>
    </div>
    </div>
  )
}

export default AuthLaout;