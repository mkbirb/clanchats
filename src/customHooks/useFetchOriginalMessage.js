import { useState, useEffect } from "react";
import { getOriginalMesssage} from '../utils/getOriginalMessage';

// Custom Hook that retrieves the Original Message based on an ID given
const useFetchOriginalMessage = (replyTo) => {
    const [originalMessage, setOriginalMessage] = useState(null);


    useEffect(() => {
        const fetchMessage = async () => {
            const message = await getOriginalMesssage(replyTo);

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