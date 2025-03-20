import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import React from "react";
import userDefaultImage from "@/assets/userDefaultImage.jpeg";

interface contact {
  _id: string;
  name: string;
  email: string;
  bio?: string;
  isOnline: boolean;
  avatar: {
    public_id: string;
    url: string;
    _id: string;
  };
  firebaseToken: string;
}
const ContactProfile = ({contactUserData}:{contactUserData:contact}) => {
  const ShowUserProfile = ( ) => {};
  return (
    <div className="relative" >
      <Dialog>
        <DialogTrigger  >
          <img
            className="md:w-12 md:h-12  w-8 h-8 rounded-full object-cover "
            src={
              contactUserData?.avatar?.url
            }
            alt="user image"
          />
          
        </DialogTrigger>
        <VisuallyHidden>
          <DialogTitle>Hidden Dialog Title</DialogTitle>
        </VisuallyHidden>
        <DialogContent className=" absolute z-10 p-3  w-80 h-auto md:w-[500px] md:h-[700px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center bg-[#222222] text-base-content gap-3" >
        
        <div className="absolute right-4 top-4"><DialogClose>
        <i className="fa-solid fa-xmark"></i>
          
          </DialogClose></div>
         <div
                  id="userImage"
                  className=" md:h-60 md:w-60 h-40 w-40 rounded-full border-4 border-white  mt-11 relative"
                >
                  <img
                    className="w-full h-full rounded-full object-cover"
                    src={contactUserData?.avatar}
                    alt="profile Picture"
                  />
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-3xl">{contactUserData?.name}</p>
          
                  </div>
                <div className="bio  flex flex-col items-center">
                  <p className="italic">East or west apple is best</p>
                  <p className="text-gray-400">Bio</p>
                </div>
                <div
                  id="name"
                  className="flex items-center justify-between gap-3 mt-10"
                >
               
                
                </div>
        
                <div id="email" className="flex items-center justify-between gap-3">
                  <p className="text-2xl pt-2">
                    <i className="fa-solid fa-envelope"></i>
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-base">{contactUserData?.email}</p>
                    <p className="text-gray-400 text-sm">Email</p>
                  </div>
                </div>
        
                <div id="joined" className="flex items-center justify-between gap-3">
                  <p className="text-2xl pt-2">
                    <i className="fa-solid fa-calendar-days"></i>
                  </p>
                  <div className="flex flex-col items-center">
                    <p className="text-base">
                      {new Date(contactUserData?.createdAt).toLocaleDateString("en-us", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-gray-400 text-sm">Joined</p>
                  </div>
                </div>
        
        
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContactProfile;
