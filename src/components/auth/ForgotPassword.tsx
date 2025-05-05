import React, { useState } from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import Api from '../../api';
import toast, { Toaster } from 'react-hot-toast';
import {z} from "zod"
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { ForgotPasswordInputs, ForgotPasswordSchema } from '@/lib/Schemas/authSchemas';

type AuthPage = 'login' | 'register1' | 'register2' |'forgot-password' | 'otp' | 'reset-password' | 'dashboard' |'verify-forgot-password' |'otp-verifyEmail';
interface ForgotPasswordProps {
  onPageChange: (page: AuthPage, email?: string) => void;
}

export function ForgotPassword({ onPageChange }: ForgotPasswordProps) {
  const [email, setEmail] = useState();
    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordInputs>({
      resolver: zodResolver(ForgotPasswordSchema),
    });
  const onSubmit =async (data:ForgotPasswordInputs) => {
    
    try {
        const response=await Api.post("/auth/forgotPassword",data);
        if(response.status==200){
            onPageChange('verify-forgot-password', email);
            toast("Otp Send Succesfully");  
        }

    } catch (error:any) {
        toast.error("Unable to Send Reset Link");
    }
  };
  return (
    
    <div className="space-y-6">
        <Toaster/>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">Enter your email to receive a reset link</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="email"
            {...register("email")}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          Send Reset Link
          <ArrowRight className="h-4 w-4" />
        </button>

        <button
          type="button"
          onClick={() => onPageChange('login')}
          className="w-full text-gray-400 hover:text-gray-300"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
}