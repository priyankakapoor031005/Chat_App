import React, { createContext, useContext, useState, useEffect } from "react";
export const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthContextProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(() => {
    const storedUser = localStorage.getItem("chatapp");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  // Sync authUser to localStorage whenever it changes
  useEffect(() => {
    if (authUser) {
      localStorage.setItem("chatapp", JSON.stringify(authUser));
    } else {
      localStorage.removeItem("chatapp");
    }
  }, [authUser]);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser }}>
      {children}
    </AuthContext.Provider>
  );
};
