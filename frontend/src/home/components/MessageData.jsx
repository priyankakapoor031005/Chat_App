import React, { useEffect, useRef, useState } from "react";
import userConversation from "../../zustand/useConversation";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { IoArrowBackCircle } from "react-icons/io5";
import { useSocketContext } from "../../context/SocketContaxt";
import notify from "../../assets/sound/Iphone Notification Tone Download.mp3";

function MessageData({ onBackUser }) {
  const {
    messages,
    selectedConversation,
    setMessages,
    setSelectedConversation,
  } = userConversation();
  const { socket } = useSocketContext();
  const { authUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendData, setSendData] = useState("");
  const lastMessageRef = useRef();
  const BASE_URL = `http://localhost:3000`;
  // import.meta.env.VITE_BACKEND_URL || "https://chat-app-dr53.onrender.com";

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      const sound = new Audio(notify);
      sound.play();
      setMessages([...messages, newMessage]);
    });
    return () => socket?.off("newMessage");
  }, [messages, socket, setMessages]);

  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const get = await axios.get(
          `/api/message/chat/${selectedConversation?._id}`
        );
        const data = await get.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.messages);
        }
        setLoading(false);
        setMessages(data);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };

    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);
  console.log(messages);

  const handleMessage = (e) => {
    setSendData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // stop form from reloading
    if (!sendData.trim()) return; // optional: avoid sending empty messages
    setSending(true);
    try {
      const response = await axios.post(
        `/api/message/send/${selectedConversation?._id}`,
        { message: sendData }
      );
      const data = response.data;

      if (data.success === false) {
        console.log(data.message);
      } else {
        setMessages([...messages, data]); // add new message
        setSendData(""); // ✅ clear input box
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSending(false); // ✅ always stop loading spinner
    }
  };

  return (
    <div className="md:min-w-[500px]  flex h-screen flex-col py-2">
      {selectedConversation === null ? (
        <div className="flex items-center justify-center w-full h-full">
          <div className="px-4 text-center text-gray-950 font-semibold flex flex-col items-center gap-2 animate-fade-in">
            <p className="text-2xl">Welcome!!🙏 {authUser.username}</p>
            <p className="text-lg">Select a chat to start messaging..</p>
            <IoChatbubbleEllipsesSharp className="text-6xl text-center animate-bounce text-sky-900" />
          </div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="flex justify-between items-center gap-2 bg-sky-600 md:px-4 px-2 py-2 rounded-lg mb-2 shadow-md animate-slide-in-top">
            <button
              onClick={() => onBackUser(true)}
              className="lg:hidden text-white hover:scale-110 transition-transform"
            >
              <IoArrowBackCircle size={25} />
            </button>
            <div className="flex items-center gap-3 w-[100px] h-[50px]">
              <img
                src={`${BASE_URL}/profileimg/${selectedConversation?.profilePic}`}
                className="w-full h-full object-cover rounded-full border-1 border-white shadow md:w-10 md:h-10 cursor-pointer hover:scale-105 transition-transform"
                alt="User"
              />
              <span className="text-white text-sm md:text-xl font-bold">
                {selectedConversation?.username}
              </span>
            </div>
          </div>

          {/* Messages */}
          <div className="overflow-y-auto px-2 space-y-3 scroll-smooth flex-grow max-h-[calc(100vh-220px)]">
            {loading ? (
              <div className="flex justify-center items-center h-full animate-pulse">
                <div className="loading loading-spinner text-sky-600 scale-150" />
              </div>
            ) : messages?.length === 0 ? (
              <p className="text-center text-gray-600 italic animate-fade-in">
                Send a message to start conversation
              </p>
            ) : (
              messages.map((message) => (
                <div
                  key={message?._id}
                  ref={lastMessageRef}
                  className={`flex ${
                    message.senderId === authUser._id
                      ? "justify-end"
                      : "justify-start"
                  } animate-fade-in-up`}
                >
                  <div
                    className={`rounded-xl px-4 py-2 text-sm break-words shadow-lg max-w-[80%] transition-all duration-200 ease-in-out hover:scale-[1.02] ${
                      message.senderId === authUser._id
                        ? "bg-sky-600 text-white"
                        : "bg-white text-gray-900"
                    }`}
                  >
                    {message.message}
                    <div className="text-[10px] mt-1 opacity-60 text-end">
                      {new Date(message?.createdAt).toLocaleTimeString(
                        "en-IN",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit} className="mt-3 animate-fade-in-up ">
            <div className="w-full bg-white flex items-center border hover:border-sky-600 border-gray-600 rounded-full shadow px-3 py-1">
              <input
                type="text"
                value={sendData}
                onChange={handleMessage}
                placeholder="Type your message..."
                className="flex-grow text-gray-600 bg-transparent px-2 py-2 text-sm outline-none"
              />
              <button type="submit">
                {sending ? (
                  <div className="loading loading-spinner text-sky-600 scale-125" />
                ) : (
                  <IoSend
                    size={30}
                    className="text-white bg-sky-700 hover:bg-sky-900 transition p-1 rounded-full"
                  />
                )}
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

export default MessageData;
