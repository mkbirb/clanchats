import logo from './logo.svg';
import React, { useState, useContext } from 'react';
import './App.css';
import SendMessage from './components/SendMessage';
import ReadMessage from './components/ReadMessage';
import ChatList from './components/ChatList';

export const CurrentUser = React.createContext();

function App() {

  const [userID, setUserID] = useState(1);
  const [roomID, setRoomID] = useState(1);

  function changeRoomID (newRoomID) {
    setRoomID(newRoomID);
  }

  return (
    <>  
      <CurrentUser.Provider value={{userID, roomID, changeRoomID}}>
          <ChatList />
          <ReadMessage />
          <SendMessage />
      </CurrentUser.Provider>
    </>
  );
}

export default App;
