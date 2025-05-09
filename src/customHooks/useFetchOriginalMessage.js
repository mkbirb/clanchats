import { useState, useEffect } from "react";
import { getOriginalMesssage} from '../utils/getOriginalMessage';
import { useCurrentUser } from "../context/CurrentUserContext";

// Custom Hook that retrieves the Original Message based on an ID given
const useFetchOriginalMessage = (replyTo) => {
    const [originalMessage, setOriginalMessage] = useState(null);

    const {roomID} = useCurrentUser();


    useEffect(() => {
        const fetchMessage = async () => {
            const message = await getOriginalMesssage(replyTo, roomID);

            setOriginalMessage(message);
        }

        if (replyTo) {
            // When the ReplyTo is avaliable, then fetch the original message
            fetchMessage();
        }
    }, [replyTo]);

    return [originalMessage, setOriginalMessage];
}

export default useFetchOriginalMessage;