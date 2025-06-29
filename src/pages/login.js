import React, { useState } from "react";
import {useRouter} from "next/router";
import {retrieveUser} from "../components/firebaseConfig.js";
import {navigateTo} from '../components/Routes';
import { useCurrentUser } from "../context/CurrentUserContext"; 
import background from '../images/jaggedcolourlinesback.jpg';
import googleIcon from '../images/googleIcon.png';
import { handleGoogleAccountSubmit } from "../utils/handleGoogleAccountSubmit.js";



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
                navigateTo(router, "DASHBOARD");
                
                changeUser(user);
            }
        }
        catch (error) {
            alert("Could not Login ", error.message);
        }
    }
    
    const toSignUp = () => {
        navigateTo(router, "SIGNUP");
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen w-screen bg-cover" style={{ backgroundImage: `url(${background.src})` }}>
                <div className="bg-black/70 !border-7 !border-orange-300 rounded-2xl w-lg flex flex-col items-center">
                    <p className="text-center text-5xl text-white font-bold underline decoration-dashed !mb-5 !mt-5"> Login </p>
                    <form onSubmit={handleSubmit} className="flex flex-col items-center">
                        <label htmlFor="email" className="text-white font-bold text-2xl !mb-3"> Email </label>
                        <input 
                            id="email" 
                            type="text" 
                            name="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            placeholder="Insert Email"
                            className="!text-2xl !bg-amber-50/80 !rounded-lg !p-1 !mb-5"
                            required ></input>
                        <label className="text-white font-bold text-2xl !mb-3" htmlFor="password"> Password </label>
                        <input 
                            id="password" 
                            type="password" 
                            name="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            placeholder="Insert Password"
                            className="!text-2xl  !bg-amber-50/80 !rounded-lg !mb-5 !p-1"
                            required></input>
                        <button type="submit" className="!bg-amber-500 !mb-7 !mt-5 !rounded-2xl w-50 h-10 cursor-pointer !text-white !text-xl !font-bold">Login</button>
                    </form>
                    <div className="cursor-pointer  !bg-white w-72 h-12 rounded-2xl flex items-center gap-5 justify-center !mb-5" onClick={(e) => handleGoogleAccountSubmit(e, changeUser, router)}>
                        <img className="size-10" src={googleIcon.src} alt="Google Icon" />
                        <p className="!text-xl !text-black !text-center !font-bold"> Login with Google </p>
                    </div>
                    <p className="text-blue-100 text-lg cursor-pointer font-bold text-center underline !mb-5" onClick={toSignUp}> Sign Up Instead </p>
                </div>
            </div>
        </>
    )
}

export default login;