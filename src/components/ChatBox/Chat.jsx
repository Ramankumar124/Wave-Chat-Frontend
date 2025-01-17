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
              className={`md:m-5 m-2 p-1 tex-xs relative md:text-xl  h-auto min-h-12 min-w-20 max-w-44 md:max-w-96 shadow-sm ${
                msg.sender === contactUserId
                  ? "bg-base-300 text-base-content"
                  : "bg-primary text-primary-content"
              } rounded-lg`}
            >
              {msg.image ? (
                <>
                  <img
                    src={msg.image}
                    alt="Shared"
                    className="w-auto max-w-52 h-auto object-cover rounded-md"
                  />
                  {msg.content && (
                    <div className="mt-4 px-3">{msg.content}</div>
                  )}
                </>
              ) : (
                <div className="px-3">{msg.content}</div>
              )}
              <div className={`w-full text-xs flex  items-end justify-end absolute 
                ${
                msg.sender === contactUserId
                  ? "text-base-content/70"
                  : "text-primary-content/70"
              }
                right-2 bottom-0`}>
                {time}
              </div>
            </div>
          </div>
        );
      })
  )
}

export default Chat