import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaSearch } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { TbArrowBigLeftLinesFilled } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import userConversation from "../../zustand/useConversation";
import { useSocketContext } from "../../context/SocketContaxt";

const Sidebar = ({ onSelectUser }) => {
  const navigate = useNavigate();
  const { authUser, setAuthUser } = useAuth();
  const [searchInput, setSearchInput] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chatUsers, setChatUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageUsers, setNewMessageUsers] = useState("");
  const { onlineUser, socket } = useSocketContext();
  // const BASE_URL =
  //   import.meta.env.VITE_BACKEND_URL || "https://chat-app-dr53.onrender.com";
  const BASE_URL = `http://localhost:3000`;

  const { messages, setSelectedConversation } = userConversation();

  // Check if the user is online
  const isOnline = (userId) => {
    return onlineUser.includes(userId);
  };

  useEffect(() => {
    socket?.on("newMessage", (newMessage) => {
      setNewMessageUsers(newMessage);
    });
    return () => socket?.off("newMessage");
  }, [messages, socket]);

  useEffect(() => {
    const fetchChatUsers = async () => {
      setLoading(true);
      try {
        const res = await axios.get("/api/user/getcurrentchatter");
        if (res.data && Array.isArray(res.data)) {
          setChatUsers(res.data);
        } else {
          toast.info("No users found.");
        }
      } catch (err) {
        toast.error("Failed to fetch chat users.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChatUsers();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    try {
      const res = await axios.get(`/api/user/search?search=${searchInput}`);
      if (res.data && Array.isArray(res.data)) {
        if (res.data.length === 0) {
          toast.info("User not found.");
        }
        setSearchResults(res.data);
      } else {
        toast.error("Unexpected response.");
      }
    } catch (err) {
      toast.error("Search failed.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (user) => {
    onSelectUser(user);
    setSelectedConversation(user);
    setSelectedUserId(user._id);
    setNewMessageUsers("");
    // navigate(`/chat/${user._id}`); // optional: navigate to chat screen
  };

  const handleSearchBack = () => {
    setSearchResults([]);
    setSearchInput("");
  };

  const HandleLogout = async () => {
    const confirmLogout = window.prompt("Type 'UserName' To LOGOUT ");
    if (confirmLogout === authUser.username) {
      setLoading(true);
      try {
        const logout = await axios.post("/api/auth/logout");
        const data = logout.data;
        if (data.success === false) {
          setLoading(false);
          console.log(data.message);
        }
        toast.info(data.message);
        localStorage.removeItem("chatapp");
        setAuthUser(null);
        setLoading(false);
        navigate("/");
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    } else {
      toast.info("Logout Cancelled");
    }
  };

  const renderUserList = (users) => (
    <div className="hidden md:block w-full overflow-y-auto px-2 pb-4 custom-scrollbar">
      {users
        .filter((user) => user && user._id)
        .map((user) => (
          <div key={user._id}>
            <div
              onClick={() => handleUserClick(user)}
              className={`flex items-center gap-4 rounded-lg p-3 cursor-pointer transition-all duration-200
              ${
                selectedUserId === user._id
                  ? "bg-sky-500 text-white"
                  : "hover:bg-sky-100"
              }
            `}
            >
              {/* Avatar */}
              <div className="relative w-[52px] h-[52px]">
                <img
                  src={`${BASE_URL}/profileimg/${user?.profilePic}`}
                  alt={user.fullname}
                  className="w-full h-full object-cover rounded-full border-2 border-white shadow"
                />

                {isOnline(user._id) && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white rounded-full z-10" />
                )}
              </div>

              {/* Username */}
              <div className="flex-1">
                <p className="font-semibold text-gray-800">{user.username}</p>
              </div>

              {/* New Message Badge */}
              {newMessageUsers.reciverId === authUser._id &&
                newMessageUsers.senderId === user._id && (
                  <div className="bg-green-600 text-white text-xs px-2 py-0.5 rounded-full shadow">
                    +1
                  </div>
                )}
            </div>

            {/* <div className="h-[1px] bg-gray-200 mx-3 my-2" /> */}
          </div>
        ))}
    </div>
  );

  //  bg-white/30 backdrop-blur-lg border-r border-white/40
  return (
    <div className="hidden md:flex relative w-full max-w-xs flex-col bg-white/20 shadow-xl">
      {/* 🔍 Search + Profile */}
      <div className="flex justify-between items-center px-4 py-3 bg-white/20 rounded-b-xl shadow">
        <form
          onSubmit={handleSearch}
          className="flex-grow flex items-center gap-2 bg-white/80 px-4 py-2 rounded-full shadow-inner focus-within:ring-2 ring-sky-500"
        >
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            type="text"
            placeholder="Search users..."
            className="flex-grow bg-transparent text-sm text-gray-700 placeholder-gray-500 focus:outline-none"
          />
          <button
            type="submit"
            className="text-sky-600 hover:text-sky-800 transition-transform hover:scale-110"
          >
            <FaSearch />
          </button>
        </form>
        <div className="w-[50px] h-[50px]">
          <img
            onClick={() => navigate(`/profile/${authUser._id}`)}
            src={`${BASE_URL}/profileimg/${authUser?.profilePic}`}
            className="w-full h-full object-cover rounded-full border-1 border-white shadow cursor-pointer hover:scale-105 transition-transform"
            alt={authUser?.username}
          />
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-300 my-2" />

      {/* 👥 User List */}
      <div className="flex-1">
        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading...</p>
        ) : searchResults.length > 0 ? (
          renderUserList(searchResults)
        ) : chatUsers.length > 0 ? (
          renderUserList(chatUsers)
        ) : (
          <div className="text-center mt-10 text-yellow-500 text-lg font-semibold">
            <p>Why are you alone? 🧐</p>
            <p>Search for someone to chat.</p>
          </div>
        )}
      </div>

      {/* ⬅️ Back Button */}
      {searchResults.length > 0 && (
        <div className="fixed bottom-6 left-4 z-50">
          <button
            onClick={handleSearchBack}
            className="bg-white shadow-md hover:shadow-lg rounded-full p-2 hover:scale-105 transition-transform"
          >
            <TbArrowBigLeftLinesFilled size={26} className="text-gray-700" />
          </button>
        </div>
      )}

      {/* 🚪 Logout */}
      {searchResults.length === 0 && (
        <div className="px-4 py-4 border-t border-white/40">
          <button
            onClick={HandleLogout}
            className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-white hover:bg-red-600 py-2 rounded-lg transition-all duration-200"
          >
            <BiLogOutCircle size={22} />
            <span className="font-semibold text-sm">Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
