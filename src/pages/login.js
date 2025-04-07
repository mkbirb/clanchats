import React, { useState } from "react";
import {useRouter} from "next/router";
import {retrieveUser} from "../components/firebaseConfig.js";
import {navigateTo} from '../components/Routes';
import { useCurrentUser } from "../context/CurrentUserContext"; 

const login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const router = useRouter();

    const { changeUser } = useCurrentUser(); 

    const handleSubmit = async(e) => {
        // Prevent refresh so we keep all the States still
        e.preventDefault();

        try {
            const user = await retrieveUser(email, password);

            if (user) {
                alert("Login successful!");

                // Navigate to Login Page, when Sign Up Sucessful
                navigateTo(router, "CHAT");
                
                changeUser(user);
            }
        }
        catch {
            alert("Could not Login ", error.message);
        }
    }

    return (
        <>
            <p> Login </p>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email"> Email </label>
                <input id="email" type="text" name="email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="password"> Password </label>
                <input id="password" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <input type="submit"></input>
            </form>
        </>
    )
}

export default login;