import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // console.log('STRING', localStorage.getItem("user"))
  // console.log('JSON.parse ', JSON.parse(localStorage.getItem("user")))
  const [currentUser, setCurrentUser] = useState(
    // JSON.parse to tranform string into object
    JSON.parse(localStorage.getItem("user")) || null
  );

  const updateUser = (data) => {
    setCurrentUser(data);
  };

  useEffect(() => {
    localStorage.setItem(
      "user", 
      JSON.stringify(currentUser)
    );
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ 
      currentUser, updateUser 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
