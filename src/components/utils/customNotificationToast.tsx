import React from 'react'
import toast, { Toast } from 'react-hot-toast'
interface NotficionProps{
    senderName:string,
    message:string,
    t:Toast
}

const CustomNotificationToast:React.FC <NotficionProps> = ({t,senderName,message}) => {
  return (
    <div
    className={`${
      t.visible ? "animate-enter" : "animate-leave"
    } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
    <div className="flex-1 w-0 p-4">
      <div className="flex items-start">
        <div className=" pt-0.5 w-10 h-10 rounded-full">
          <p className="text-xl font-bold w-10 h-10 bg-primary-content flex items-center justify-center rounded-full">
            {senderName[0].toUpperCase()}
          </p>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {senderName}
          </p>
          <p className="mt-1 text-sm text-gray-500">{message}</p>
        </div>
      </div>
    </div>
    <div className="flex border-l border-gray-200">
      <button
        onClick={() => toast.dismiss(t.id)}
        className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        Close
      </button>
    </div>
    </div>
  )
}

export default CustomNotificationToast
