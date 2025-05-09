import React, { createContext, useContext, useState } from "react";

const CurrentUserContext = createContext();

// Provider component
export function CurrentUserProvider({ children }) {
    const [userID, setUserID] = useState();
    const [roomID, setRoomID] = useState();
    const [user, setUser] = useState("");
  
    function changeRoomID(newRoomID) {
      setRoomID(newRoomID);
    }

    function changeUser(newUser) {
      setUser(newUser);
      console.log("Head ", newUser.id);
      setUserID(newUser.id);
    }
  
    return (
      <CurrentUserContext.Provider value={{ userID, roomID, user, changeRoomID, changeUser }}>
        {children}
      </CurrentUserContext.Provider>
    );
  }
  
  // Hook to use the context in components
  export function useCurrentUser() {
    return useContext(CurrentUserContext);
  }