import Api from "@/api";
import { register2FormSchema } from "@/lib/Schemas/authSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, Camera, User } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Bounce, ToastContainer,toast } from "react-toastify";
import { z } from "zod";

type AuthPage = 'login' | 'register1' | 'register2' |'forgot-password' | 'otp' | 'reset-password' | 'dashboard' |'verify-forgot-password' |'otp-verifyEmail';
interface RegisterProps {
  onPageChange: (page: AuthPage, email?: string) => void;
  localdata:any,
  setlocaldata:any
}

const Register2 = ({ onPageChange ,localdata,setlocaldata}: RegisterProps) => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  type Register2Inputs = z.infer<typeof register2FormSchema>;
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<Register2Inputs>({
    resolver: zodResolver(register2FormSchema),
  });
  const onSubmit = async (data: Register2Inputs) => {
    // Update localdata with Register2 form data
    const updatedData = { ...localdata, ...data };
    setlocaldata(updatedData);
    
    // Check if all required data is present
    if (updatedData.email && updatedData.password && updatedData.name && updatedData.bio && updatedData.avatar) {
      try {
        // Prepare FormData for API call
        const formData = new FormData();
        formData.append("email", updatedData.email);
        formData.append("password", updatedData.password);
        formData.append("name", updatedData.name);
        formData.append("bio", updatedData.bio);
        formData.append("avatar", updatedData.avatar[0]); // Append the file

        // Make API call
        const response = await Api.post("/auth/register", formData,{
            headers: {
              "Content-Type": "multipart/form-data", // Set the content type
            },});
        
          onPageChange("otp-verifyEmail", updatedData.email); // Navigate to OTP page
        
      } catch (error:any) {
  
        
        toast.error(error?.response?.data?.message | error?.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
          transition: Bounce,
          });
        console.error("Error during registration:", error);
      }
    } else {
      console.error("All fields are required.");
    }
  };
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarPreview(URL.createObjectURL(file)); // Create preview URL
      setValue("avatar", [file]); // Set the file in the form state
      trigger("avatar"); // Trigger validation for the avatar field
    }
  };

  return (
    <div>
      <ToastContainer/>
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white">Create Account</h1>
        <p className="text-gray-400 mt-2">Step 2 of 2</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Avatar Upload */}

        <div className="space-y-2">
          <div className="relative w-32 h-32 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full  cursor-pointer relative"
              onClick={() => document.getElementById("avatar-upload")?.click()}
            >
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Avatar Preview"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <div className="w-full h-full bg-gray-700 flex items-center justify-center rounded-full">
                  <User className="w-16 h-16 text-gray-400" />
                </div>
              )}
              <div className="absolute  bottom-2 z-50 right-0 bg-orange-500  p-1 rounded-full">
                <Camera className="w-4 h-4  text-white" />
              </div>
            </div>
            <input
              type="file"
              accept="image/*"
              {...register("avatar")}
              onChange={handleFileChange}
              className="hidden"
              id="avatar-upload"
            />
            {errors.avatar && (
              <p className="text-red-500 text-sm text-center mt-2">
                {errors.avatar?.message?.toString()}
              </p>
            )}
          </div>
        </div>

        {/* Name Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-3 text-gray-400 h-5 w-5" />
            <input
              {...register("name")}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white "
              placeholder="Your Name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>
        </div>

        {/* Bio Field */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-200">Bio</label>
          <div className="relative">
            <textarea
              {...register("bio")}
              className="w-full pl-4 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-white"
              placeholder="Tell us about yourself"
              rows={2}
            />
            {errors.bio && (
              <p className="text-red-500 text-sm">{errors.bio.message}</p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-between gap-6 mx-8">
        <button
          type="button"
          onClick={()=>onPageChange("register1")}
          className="w-fit bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
        <button
          type="submit"
          className="w-fit bg-purple-600 text-white py-2 px-6 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 mt-4"
        >
          Next
          <ArrowRight className="h-4 w-4" />
        </button>
        </div>
      </form>
    </div>
  );
};

export default Register2;