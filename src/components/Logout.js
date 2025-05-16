import React from 'react';
import {useRouter} from "next/router";
import {logout} from "./firebaseConfig.js";
import { navigateTo } from './Routes.js';

const Logout = () => {
    const router = useRouter();

    const handleLogout = async () => {
        const loggedOut = await logout();
        
        if(loggedOut) {
            navigateTo(router, 'LOGIN');
            console.log("Logged Out");
            alert("You have Logged Out");
        }
    }

    return (
        <>
            <button onClick={() => handleLogout()}> Logout </button>
        </>
    )
}

export default Logout;