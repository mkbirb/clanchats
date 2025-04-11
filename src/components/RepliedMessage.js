import React from "react";
import useFetchOriginalMessage from "../customHooks/useFetchOriginalMessage";

const RepliedMessage = ({ replyTo }) => {
    const [originalMessage] = useFetchOriginalMessage(replyTo);
  
    if (!replyTo || !originalMessage) return null;
  
    return (
      <p style={{ fontStyle: "italic", color: "gray" }}>
        Replying to: "{originalMessage.text}"
      </p>
    );
  };
  
  export default RepliedMessage;