import React from 'react'

const Chat = ({chat,contactUserId}) => {
  return (
    chat.map((msg, idx) => {
        const createdAtDate = new Date(msg.createdAt);

        const time = !isNaN(createdAtDate.getTime())
          ? createdAtDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          : "Invalid Date";

        return (
          <div
            key={idx}
            id="outer-msg-box"
            className={`${
              msg.recipient === contactUserId
                ? "flex justify-end"
                : "flex justify-start"
            }`}
          >
            {/* {msg.image ? <img src={msg.image} alt="Shared" className="w-auto h-[300px]" /> : null} */}
            <div
              className={`m-5 p-1  relative text-xl text-white h-auto min-h-12 min-w-20 max-w-[400px] ${
                msg.sender === contactUserId
                  ? "bg-[#474545]"
                  : "bg-[#2d7d4a]"
              } rounded-lg`}
            >
              {msg.image ? (
                <>
                  <img
                    src={msg.image}
                    alt="Shared"
                    className="w-auto h-auto object-cover rounded-md"
                  />
                  {msg.content && (
                    <div className="mt-4 px-3">{msg.content}</div>
                  )}
                </>
              ) : (
                <div className="px-3">{msg.content}</div>
              )}
              <div className="w-full text-xs flex  items-end justify-end absolute text-gray-200 right-2 bottom-0">
                {time}
              </div>
            </div>
          </div>
        );
      })
  )
}

export default Chat