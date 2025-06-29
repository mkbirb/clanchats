import React, { useState } from "react";
import {useRouter} from "next/router";
import {createUser, signInWithGoogle, retrieveGoogleAccountUser} from "../components/firebaseConfig.js";
import {navigateTo} from '../components/Routes';
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { handleGoogleAccountSubmit } from "../utils/handleGoogleAccountSubmit.js";


const signUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    
    const { changeUser } = useCurrentUser();
    // For the Navigation to success page
    const router = useRouter();

    const handleSubmit = async (e) => {
        // Prevent refresh so we keep all the States still
        e.preventDefault();
        
        // Validate and ensure that the Passwords inputted matches
        if(password !== confirmPassword) {
            alert("Passwords do not Match");
            return;
        }

        // Attempt to create the User
        try {
            const isUserCreated = await createUser(email, username, accountName, password);

            if (isUserCreated) {
                alert("Account created successfully!");

                // Navigate to Login Page, when Sign Up Sucessful
                navigateTo(router, "LOGIN")
            }
            else {
                console.log("Account creation failed");
            }
        }
        catch (error) {
            console.error("Signup failed:", error.message);
        }
    }

    return (
        <>
            <h1 className="font-mono text-3xl font-bold text-blue-600"> Sign up!!</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email"> Email </label>
                <input id="email"type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)}></input>
                <label htmlFor="username"> Username </label>
                <input id="username" type="text" placeholder="Enter Username" value={username} onChange={(e) => setUsername(e.target.value)}></input>
                <label htmlFor="name"> Name </label>
                <input id="name" type="text" placeholder="Enter Name" value={accountName} onChange={(e) => setAccountName(e.target.value)}></input>
                <label htmlFor="password"> Password </label>
                <input id="password" type="password" placeholder="Enter Password" value={password} onChange={(e) => setPassword(e.target.value)}></input>
                <label htmlFor="confirmPassword"> Confirm Password </label>
                <input id="confirmPassword" type="password" placeholder="Confirm your Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}></input>
                <button className="!bg-blue-500 text-white p-2 !rounded hover:bg-blue-700 !bg-blue-500">
                    Submit
                </button>
            </form>
            <button onClick={(e) => handleGoogleAccountSubmit(e, changeUser, router)}> Sign Up with Google </button>
        </>
    )
}

export default signUp