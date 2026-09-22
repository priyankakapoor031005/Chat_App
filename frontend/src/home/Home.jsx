import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import MessageData from "./components/MessageData";

const Home = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isSidebar, setIsSidebar] = useState(true);

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setIsSidebar(false); // Hide sidebar on mobile
  };

  const handleShowSidebar = () => {
    setSelectedUser(null);
    setIsSidebar(true); // Show sidebar again
  };

  return (
    <div className="flex w-full h-[90vh] md:h-100px overflow-hidden px-2 rounded-xl shadow-lg bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0">
      {/* Sidebar */}
      <div
        className={`transition-all duration-300
          ${isSidebar ? "block w-full" : "hidden"}
          md:flex md:w-[30%]`}
      >
        <Sidebar onSelectUser={handleUserSelect} />
      </div>

      {/* Divider - Desktop Only */}
      <div className="divider divider-horizontal px-3 hidden md:flex"></div>

      {/* Message Container */}
      <div
        className={`flex-auto
          ${selectedUser ? "block" : "hidden"}
          md:flex md:flex-col md:w-[70%]`}
      >
        <MessageData onBackUser={handleShowSidebar} />
      </div>
    </div>
  );
};

export default Home;
