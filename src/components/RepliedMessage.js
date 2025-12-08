import React from "react";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";

const RepliedMessage = ({clanID, roomType, replyTo }) => {
    const [originalMessage] = useFetchOriginalMessage(clanID, roomType, replyTo);
  
    if (!replyTo || !originalMessage) return null;
  
    return (
      <p className="italic text-gray-700">
        Replying to: 
        {originalMessage.text && originalMessage.imageURL
          ? ` 🏞️ Image | "${originalMessage.text}"`
          : originalMessage.text
          ? ` "${originalMessage.text}"`
          : originalMessage.imageURL
          ? " 🏞️ Image"
          : null}
      </p>
    );
  };
  
  export default RepliedMessage;