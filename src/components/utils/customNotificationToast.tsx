import React from "react";
import toast, { Toast } from "react-hot-toast";
interface NotficionProps {
  senderName: string;
  message: string;
  t: Toast;
}

const CustomNotificationToast: React.FC<NotficionProps> = ({
  t,
  senderName,
  message,
}) => {
  return (
    <div
      className={`${
        t.visible ? "animate-enter" : "animate-leave"
      } max-w-md w-[85%] md:w-auto bg-white shadow-lg rounded-lg pointer-events-auto flex flex-col md:flex-row ring-1 ring-black ring-opacity-5 mx-2 md:mx-0 scale-90 md:scale-100`}
    >
      <div className="flex-1 w-full p-2 md:p-4">
        <div className="flex items-start">
          <div className="pt-0.5 w-7 h-7 md:w-10 md:h-10 rounded-full shrink-0">
            <p className="text-base md:text-xl font-bold w-7 h-7 md:w-10 md:h-10 bg-primary-content flex items-center justify-center rounded-full">
              {senderName[0].toUpperCase()}
            </p>
          </div>
          <div className="ml-2 md:ml-3 flex-1 overflow-hidden">
            <p className="text-xs md:text-sm font-medium text-gray-900 truncate">
              {senderName}
            </p>
            <p className="mt-0.5 md:mt-1 text-xs md:text-sm text-gray-500 line-clamp-2 text-[10px] ">
              {message}
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CustomNotificationToast;
