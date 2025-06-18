// Button that leads to the Clan Home Page
import React from "react";

import { useRouter } from "next/router";
import { navigateTo } from "./Routes";

const ToClanHome = () => {
    // Gets the Clan ID from the URL Params, which should be same as the Dynamic Folder in Next.js Pages Folder Structure!
    const router = useRouter();
    const {clan} = router.query;

    return (
        <>
            <button onClick={() => navigateTo(router, 'CHAT', clan)}> To Clan Home</button>
        </>
    )
}

export default ToClanHome;