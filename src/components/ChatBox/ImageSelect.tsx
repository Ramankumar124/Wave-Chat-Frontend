import React from 'react'
import { Button } from '../ui/button'
interface ImageSelectProps {
    data: {
      selectedImage: string; // Adjust the type based on your actual data
      removeImage: () => void;
      message: string;
      setMessage: (message: string) => void;
      handleImageSend: () => void;
    };
  }
const ImageSelect:React.FC<ImageSelectProps> = ({data:{selectedImage,removeImage,message,setMessage,handleImageSend}}) => {
  return (
    <div className="fixed w-screen h-screen  z-10">
    <div
      className="fixed w-auto h-auto max-h-[600px] max-w-[700px] z-10 top-1/2 left-1/2  -translate-x-1/2 -translate-y-1/2  z-100 
      rounded-2xl bg-gray-700"
    >
      {selectedImage && (
        <div className=" w-full h-full min-w-80 md:px-16 px-4">
          <div className="flex my-5 items-center justify-start gap-6 ">
            <button
              onClick={removeImage}
              className="  text-gray-300  md:text-6xl text-2xl w-6 h-6 flex items-center justify-center"
            >
              &times;
            </button>
            <h2 className="text-base-content md:text-3xl t font-bold">
              Send Image
            </h2>
          </div>
          <img
            src={selectedImage}
            alt="Selected"
            className="w-auto h-auto object-center   object-cover"
          />
          <div className="flex mt-5 mb-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="bg-transparent text-white w-full outline-none"
              placeholder="Add a Caption...."
            />
            <Button
            disabled
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleImageSend}
            >
              Send{" "}
            </Button>
          </div>
        </div>
      )}
    </div>
    </div>
  )
}

export default ImageSelect


