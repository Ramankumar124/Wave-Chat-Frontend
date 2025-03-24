import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import userDefaultImage from "@/assets/userDefaultImage.jpeg";
import { Toaster,toast } from "react-hot-toast";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@/context/UserContext";
import api from "@/api";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store/store";

const UserProfile = () => {
  const [selectedImage, setselectedImage] = useState<File | null>(null);

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
        // setUserData(response.data.user);

         console.log("image uploaded successfully");
      }
     }
    }
    handleImageUpload();
  }
}, [selectedImage])

  const data=useSelector((state:RootState)=>state.auth.user)
  return (
    <Sheet>
      <Toaster/>
      <SheetTrigger asChild>
        <Button className="bg-transparent text-base-content border-none  w-0   hover:bg-transparent text-2xl">
          <i className="fa-solid fa-user text-xl md:text-3xl"></i>
        </Button>
      </SheetTrigger>
      <SheetContent className=" flex flex-col items-center bg-[#222222] text-white  ">
        <SheetHeader>
          <SheetTitle className="text-4xl text-white">Profile</SheetTitle>
        </SheetHeader>

        <div
          id="userImage"
          className=" h-40 w-40 rounded-full border-4 border-white  mt-11 relative"
        >
          <img
            className="w-full h-full rounded-full object-cover"
            src={data?.avatar?data?.avatar.url:userDefaultImage}
            alt="profile Picture"
          />
          <div className=" absolute bottom-2 right-0 bg-orange-500 p-1 px-2 rounded-full">
            <label className="cursor-pointer">
              <i className="fa-solid fa-camera"></i>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                name="profilePicture"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  if (e.target.files && e.target.files[0]) {
                    setselectedImage(e.target.files[0]);
                  }
                }}
              />
            </label>
          </div>
        </div>
        <div className="bio  flex flex-col items-center">
          <p>this is my bio</p>
          <p className="text-gray-400">Bio</p>
        </div>
        <div
          id="name"
          className="flex items-center justify-between gap-3 mt-10"
        >
          <p className="text-2xl pt-2">
            {" "}
            <i className="fa-solid fa-at"></i>{" "}
          </p>
          <div className="flex flex-col items-center">
            <p className="text-lg">{data?.name}</p>
            <p className="text-gray-400 text-sm">Username</p>
          </div>
        </div>

        <div id="email" className="flex items-center justify-between gap-3">
          <p className="text-2xl pt-2">
            <i className="fa-solid fa-envelope"></i>
          </p>
          <div className="flex flex-col items-center">
            <p className="text-base">{data?.email}</p>
            <p className="text-gray-400 text-sm">Email</p>
          </div>
        </div>

        <div id="joined" className="flex items-center justify-between gap-3">
          <p className="text-2xl pt-2">
            <i className="fa-solid fa-calendar-days"></i>
          </p>
          <div className="flex flex-col items-center">
            <p className="text-base">
              
              {data?.createdAt
                ? new Date(data.createdAt).toLocaleDateString("en-us", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
            <p className="text-gray-400 text-sm">Joined</p>
          </div>
        </div>

        
      </SheetContent>
    </Sheet>
  );
};

export default UserProfile;
