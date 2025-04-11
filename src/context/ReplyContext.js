// Context, so the Reply States can be shared.

import { createContext, useState } from "react";

export const ReplyContext = createContext();

export const ReplyProvider = ({children}) => {
    const [replyTo, setReplyTo] = useState(null);

    return(
        <ReplyContext.Provider value={{replyTo, setReplyTo}}>
            {children}
        </ReplyContext.Provider>
    )
}