import React, { useEffect, useState } from "react";
import { Mail, Lock, User, ArrowRight, Image as ImageIcon, Eye, EyeOff } from "lucide-react";
import { register1FormSchema} from "@/lib/Schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {z} from "zod"

interface RegisterProps {
  onPageChange: (page: string, email?: string) => void;
  localdata:any,
  setlocaldata:any
}
type Register1Inputs = z.infer<typeof register1FormSchema>;
export function Register1({ onPageChange,localdata,setlocaldata }: RegisterProps) {
  const [isPassword, setIsPassword] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Register1Inputs>({
    resolver: zodResolver(register1FormSchema),
  });


  useEffect(() => {
    console.log(errors);
  }, [errors]);

  function passwordToggle(){
    setIsPassword(!isPassword);
  }

  const onSubmit = (data: Register1Inputs) => {
    setlocaldata((prev:any) => ({ ...prev, ...data }));
    onPageChange("register2")
  };
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Step 1 of 2</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="email"
                  {...register("email")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white "
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-200">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type={isPassword?"password":"text"}
                  {...register("password")}
                  className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
                  placeholder="Create a password"
                />
                {isPassword?
                     <Eye onClick={passwordToggle} className="absolute h-7  w-7 right-3 top-1/2 -translate-y-1/2 text-gray-400 " />:
                     <EyeOff onClick={passwordToggle} className="absolute h-7  w-7 right-3 top-1/2 -translate-y-1/2 text-gray-400 " />
                }
             
                {errors.password && (
                  <p className="text-red-500 text-sm">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
           Next
          <ArrowRight className="h-4 w-4" />
        </button>
        <p className="text-center text-gray-400">
          Already have an account?
          <button
            type="button"
            onClick={() => onPageChange('login')}
            className="text-purple-400 hover:text-purple-300"
          >
            Sign In
          </button>
        </p>
      </form>
    </div>
  );
}