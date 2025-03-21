import React, { createContext, useContext, useState } from "react";

const CurrentUserContext = createContext();

// Provider component
export function CurrentUserProvider({ children }) {
    const [userID, setUserID] = useState(1);
    const [roomID, setRoomID] = useState(1);
  
    function changeRoomID(newRoomID) {
      setRoomID(newRoomID);
    }
  
    return (
      <CurrentUserContext.Provider value={{ userID, roomID, changeRoomID }}>
        {children}
      </CurrentUserContext.Provider>
    );
  }
  
  // Hook to use the context in components
  export function useCurrentUser() {
    return useContext(CurrentUserContext);
  }