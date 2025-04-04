import React from "react";
import {useRouter} from "next/router";
import {navigateTo} from '../components/Routes';

const home = () => {

    const router = useRouter();

    const handleClick = (route) => {
        // Allows Navigation to a specific URL of the website
        navigateTo(router, route);
    }
    return (
        <>
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Welcome Clanschat!!</h1>
            <button onClick={() => handleClick('SIGNUP')}> Sign Up </button>
            <button> Login </button>
        </>
    )
}

export default home;