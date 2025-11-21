import React from "react";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";

const RepliedMessage = ({clanID, roomType, replyTo }) => {
    const [originalMessage] = useFetchOriginalMessage(clanID, roomType, replyTo);
  
    if (!replyTo || !originalMessage) return null;
  
    return (
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Replying to: "{originalMessage.text}"
      </p>
    );
  };
  
  export default RepliedMessage;