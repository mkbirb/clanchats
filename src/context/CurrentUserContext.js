import React, { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { getUserByID } from "../components/firebaseConfig";

const CurrentUserContext = createContext();

// Provider component
export function CurrentUserProvider({ children }) {
    const [userID, setUserID] = useState();
    const [roomID, setRoomID] = useState();
    const [user, setUser] = useState("");
    const [loading, setLoading] = useState(true);
  
    function changeRoomID(newRoomID) {
      setRoomID(newRoomID);
    }

    function changeUser(newUser) {
      setUser(newUser);
      console.log("Head ", newUser.id);
      setUserID(newUser.id);
    }

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
          const userData = await getUserByID(firebaseUser.uid);
          if (userData) {
            setUser(userData);
            setUserID(userData.id);
          } else {
            // Fallback if the User Doc does not exist for some reason
            setUser({
              id: firebaseUser.uid,
              email: firebaseUser.email,
              username: "Unknown"
            });
            setUserID(firebaseUser.uid);
          }
        } else {
          setUser(null);
          setUserID(null);
        }
        setLoading(false);
      });

      return () => unsubscribe();
    }, []);
  
    return (
      <CurrentUserContext.Provider value={{ userID, roomID, user, changeRoomID, changeUser, loading}}>
        {children}
      </CurrentUserContext.Provider>
    );
  }
  
  // Hook to use the context in components
  export function useCurrentUser() {
    return useContext(CurrentUserContext);
  }