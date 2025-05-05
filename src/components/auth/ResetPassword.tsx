import React, { useState } from "react";
import { Lock, ArrowRight } from "lucide-react";
import { z } from "zod";
import Api from "@/api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast, { Toaster } from "react-hot-toast";

type AuthPage = 'login' | 'register1' | 'register2' |'forgot-password' | 'otp' | 'reset-password' | 'dashboard' |'verify-forgot-password' |'otp-verifyEmail';
interface ResetPasswordProps {
  onPageChange: (page: AuthPage) => void;
}

export const ResetPasswordSchema = z
.object({
  password: z
    .string({ required_error: "password required" })
    .min(8, { message: "password must be 8 characters" }),
  confirmPassword: z.string(),
})
.refine((data) => {
  if (data.password !== data.confirmPassword) {
    toast.error("password do not match ");
    return false;
  }
  return true;
});

type ResetPasswordInputs = z.infer<typeof ResetPasswordSchema>;

export function ResetPassword({ onPageChange }: ResetPasswordProps) {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInputs>({
    resolver: zodResolver(ResetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      const response = await Api.post("/auth/resetPassword", data);
      if (response.status == 201) {
        toast("password changes sucessfully");
        onPageChange("login");
      }
    } catch (error: any) {
      toast.error("unable to change password");


    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Reset Password</h1>
        <p className="text-gray-400 mt-2">Enter your new password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            New Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              {...register("password")}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              placeholder="Enter new password"
              required
            />
            {errors.password && (
              <p className="error-message">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              placeholder="Confirm new password"
              required
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword.message}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
        >
          Reset Password
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}
