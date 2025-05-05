import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSeparator,
    InputOTPSlot,
  } from "../ui/input-otp"
import Api from '@/api';

import { otpSchema,OtpInput } from '@/lib/Schemas/authSchemas';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast, { Toaster } from 'react-hot-toast';


type AuthPage = 'login' | 'register1' | 'register2' |'forgot-password' | 'otp' | 'reset-password' | 'dashboard' |'verify-forgot-password' |'otp-verifyEmail';
interface OTPVerificationProps {
  email: string;
  onPageChange: (page: AuthPage) => void;
}

const VerifyForgotPassword=({ email, onPageChange }: OTPVerificationProps) =>{

  const {register,handleSubmit,formState:{errors,isSubmitting},setValue}=useForm<OtpInput>({
    resolver:zodResolver(otpSchema)
  })

  const onSubmit=async(data:OtpInput)=>{
    
    try {
     const response=await Api.post('/auth/verifyForgotPasswordOtp',data)
  
     if(response.status===201){
     onPageChange('reset-password');
     }
    } catch (error) {
      toast.error("Unable to Reset Password")
    }
  }

  const resendOtpHandler=async()=>{
    try {
      const response= await Api.post("/auth/resendEmail",{email})
      toast("Email Resend Successfully")
    } catch (error:any) {
      toast("Unable to Resend otp")
    }
  }
    
      
  return (
    <div className="space-y-6">
      <Toaster/>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Enter OTP</h1>
        <p className="text-gray-400 mt-2">
          We've sent a code to {email}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-center gap-2">
        <div className="space-y-2">
      <InputOTP
        maxLength={6}
        onChange={(newValue: string) => setValue("otp", newValue)}
      >
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
        </InputOTPGroup>
          <InputOTPSeparator />
        <InputOTPGroup>

          <InputOTPSlot index={3} />
          <InputOTPSlot index={4} />
          <InputOTPSlot index={5} />
        </InputOTPGroup>
      </InputOTP>
      <div className="text-center text-sm">
          <p>Enter your one-time password.</p>
      </div>
    </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          Verify OTP
          <ArrowRight className="h-4 w-4" />
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={resendOtpHandler}
            className="text-purple-400 hover:text-purple-300"
          >
            Resend Code
          </button>
        </div>
      </form>
    </div>
  );
}

export default VerifyForgotPassword;