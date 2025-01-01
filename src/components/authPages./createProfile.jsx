import React, { useEffect } from 'react';
import api from '../../api';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { toast, Toaster } from 'react-hot-toast';
import { useUser } from '@/context/UserContext';
import userDefaultImage from "@/assets/userDefaultImage.jpeg";

const CreateProfile = () => {

  const navigate = useNavigate();



const {data,setUserData} = useUser();
  const [selectedImage, setselectedImage,] = useState(null);
const [name, setName] = useState("");
const [bio, setUserBio] = useState("");

useEffect(() => {

  if(selectedImage){

    const handleImageUpload = async () => {
      const formData = new FormData();
      formData.append("profilePicture", selectedImage);
      const response=await api.post("/updateUser",formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      )

     if(response){
       console.log(response);
       if(response.status===200){
        toast.success("Image Changed successfully");
        setUserData(response.data.user);

         console.log("image uploaded successfully");
      }
     }
    }
    handleImageUpload();
  }
}, [selectedImage])

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(data.email);
      
      let response = await api.post('auth/createProfile', {email:data.email,bio, name });
      if (response.status === 200) {
        toast.success('Account Created Successfuly');
        navigate('/home');
      }
    } catch (error) {
      console.log(error);
      toast.error('Wrong Credentials');
    }
  };






  return (
    <div className="flex login-container items-center justify-center w-screen min-h-screen bg-gray-100 text-black md:bg-[length:125%_125%]">
      <div>
        <Toaster />
      </div>
      <div className=" max-w-md p-6 bg-white rounded-lg shadow-lg flex flex-col items-center">
        <h1 className="text-4xl font-bold text-center font-mono">Wave Chat</h1>
        <h1 className="text-2xl font-bold text-center mb-6">Create Profile</h1>
       
               <div
                 id="userImage"
                 className=" h-40 w-40 rounded-full border-4 border-white  mt-11 relative"
               >
                 <img
                   className="w-full h-full rounded-full object-cover"
                   src={data?.profilePicture?data?.profilePicture:userDefaultImage}
                   alt="profile Picture"
                 />
                 <div className=" absolute bottom-2 right-0 bg-orange-500 p-1 px-2 rounded-full">
                   <label className="cursor-pointer">
                     <i class="fa-solid fa-camera"></i>
                     <input
                       type="file"
                       accept="image/*"
                       className="hidden"
                       name="profilePicture"
                       onChange={(e) => {
                         setselectedImage(e.target.files[0]);
                       }}
                     />
                   </label>
                 </div>
               </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="name"
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 mt-2 border rounded-lg focus:ring text-black focus:text-black focus:ring-opacity-50 focus:ring-blue-400 bg-white"
              placeholder="Enter your email"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <input
              type="text"
              onChange={(e) => setUserBio(e.target.value)}
              className="w-full px-4  mt-2 border-b-2    focus:outline-none bg-white"
              placeholder="Enter your bio"
            />
          </div>

          <button
            type="submit"
            className="w-full px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          >
            Create Account
          </button>
        </form>

    

   
        </div>
      </div>

  );
};

export default CreateProfile;
