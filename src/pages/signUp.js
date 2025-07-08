import React, { useState } from "react";
import {useRouter} from "next/router";
import {createUser, signInWithGoogle, retrieveGoogleAccountUser, isUsernameTaken, isEmailTaken} from "../components/firebaseConfig.js";
import {navigateTo} from '../components/Routes';
import { useCurrentUser } from "../context/CurrentUserContext"; 
import { handleGoogleAccountSubmit } from "../utils/handleGoogleAccountSubmit.js";
import background from '../images/jaggedlinesedittedback.png';
import useImagePreview from "../customHooks/useImagePreview.js";
import { uploadImageToImgBB } from "../utils/imageUpload.js";
import GoogleLogin from "../components/GoogleLogin.js";


const signUp = () => {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [accountName, setAccountName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [signUpField, setSignUpField] = useState("email");
    const [profilePicture, setProfilePicture] = useState("");

    const [tempProfilePicture, setTempProfilePicture] = useState(null);
    const { previewURL, handleImageChange, resetPreview } = useImagePreview();

    // For the displaying of the Error 
    const [fieldError, setFieldError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    
    const { changeUser } = useCurrentUser();
    // For the Navigation to success page
    const router = useRouter();

    const handleSubmit = async (e) => {
        // Prevent refresh so we keep all the States still
        e.preventDefault();

        setPasswordError("");
        setConfirmPasswordError("");


        console.log("Form Submitted. Current field:", signUpField);
        
        // Validate and ensure that the Passwords inputted matches
        if (password.length < 6) {
            setPasswordError("Password must be at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setConfirmPasswordError("Passwords do not match.");
            return;
        }
        // Attempt to create the User
        try {
            const isUserCreated = await createUser(email, username, accountName, password, profilePicture);

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

    function ErrorHint({ message }) {
        if (!message) return null;
        return <p className="text-red-500 text-sm mt-1">{message}</p>;
    }

    // For the shifting of the field
    const shiftingSignUpField =  async (currentField) => {
        if (currentField === "email") {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setFieldError("Please enter a valid email address.");
                return; 
            }
            const taken = await isEmailTaken(email);
            if (taken) {
                setFieldError("There is already an account for this Email");
                return;
            }

            setFieldError("");
            setSignUpField("username");
        }
        else if (currentField === "username") {
            if (!username || username.length < 3) {
                setFieldError("Username must be at least 3 characters.");
                return;
            }

            const taken = await isUsernameTaken(username);
            if (taken) {
                setFieldError("Username already exists");
                return;
            }
            setFieldError("");
            setSignUpField("name");
        }
        else if (currentField === "name") {
            if (!accountName || accountName.length < 3) {
                setFieldError("Please enter a valid name, which is larger than 3 Characters.");
                return;
            }
            setFieldError("");
            setSignUpField("profilePicture");
        }
        else if (currentField === "profilePicture") {
            if (!tempProfilePicture) {
                setFieldError("Please upload a profile picture.");
                return;
            }

            setFieldError("");
            setSignUpField("password");
        }
        else if (currentField === "startOver") {
            setSignUpField("email")
            setFieldError("");

            // Reset the fields
            setEmail("");
            setAccountName("");
            setUsername("");
            setPassword("");
            setTempProfilePicture("");
            setProfilePicture("");
            setConfirmPassword("");

            resetPreview();
        }
        else {
            // For the reseting of the State
            setSignUpField("email")
            setFieldError("");
        }
    }

    const goBackSignUpField = (currentField) => {
        if (currentField === "username") {
            setSignUpField("email");
        } 
        else if (currentField === "profilePicture") {
            setSignUpField("name");
        }
        else if (currentField === "name") {
            setSignUpField("username");
        } 
        else if (currentField === "password") {
            setSignUpField("profilePicture");
        } 
        else if (currentField === "confirmPassword") {
            setSignUpField("password");
        }
    };

    const handleProfilePicture = async (e) => {

        if (!tempProfilePicture) {
            setFieldError("Please upload a profile picture.");
            return;
        }

        // Upload image and get URL
        const imageUrl = await uploadImageToImgBB(tempProfilePicture);

        setProfilePicture(imageUrl);
    };

    const toLogin = () => {
        navigateTo(router, "LOGIN");
    }

    return (
        <>
            <div className="flex justify-center items-center h-screen w-screen bg-cover" style={{ backgroundImage: `url(${background.src})` }}>
                <div className="bg-black/70 !border-7 !border-orange-300 rounded-2xl w-lg flex flex-col items-center">
                    <p className="text-center text-5xl text-white font-bold underline decoration-dashed !mb-5 !mt-5"> Sign Up </p>
                    <div className="!grid !grid-cols-2 !gap-3">
                        <button 
                            type="button"
                            onClick={() => goBackSignUpField(signUpField)} 
                            className="!bg-gray-400 !mb-7 !mt-5 !rounded-2xl w-35 h-8 cursor-pointer !text-white !text-xl !font-bold">
                            Back
                        </button>
                        <button 
                            type="button"
                            onClick={() => shiftingSignUpField("startOver")} 
                            className="!bg-gray-400 !mb-7 !mt-5 !rounded-2xl w-35 h-8 cursor-pointer !text-white !text-xl !font-bold">
                            Start Over
                        </button>
                    </div>
                    <form
                        onSubmit={(e) => {
                            if (signUpField !== "password") {
                                // Prevent accidental submission
                                e.preventDefault();
                                shiftingSignUpField(signUpField); 
                            } 
                            else {
                                handleSubmit(e);
                            }
                        }}
                        className="flex flex-col items-center">
                        {signUpField === "email" && (
                            <>
                                <label htmlFor="email" className="text-white font-bold text-2xl !mb-3"> Email </label>
                                <input 
                                    id="email"
                                    type="email" 
                                    autoComplete="email"
                                    placeholder="Enter Email" 
                                    value={email} onChange={(e) => {setEmail(e.target.value); setFieldError("")}}
                                    className="!text-2xl !bg-amber-50/80 !rounded-lg !p-1 !mb-5"></input>
                                    <ErrorHint message={fieldError} />
                                    
                            </>)}
                        {signUpField === "username" && (
                            <>
                                <label htmlFor="username" className="text-white font-bold text-2xl !mb-3"> Username </label>
                                <input 
                                    id="username" 
                                    type="text" 
                                    placeholder="Enter Username" 
                                    value={username} 
                                    onChange={(e) => {setUsername(e.target.value); setFieldError("")}}
                                    className="!text-2xl !bg-amber-50/80 !rounded-lg !p-1 !mb-5"></input>
                                    <ErrorHint message={fieldError} />
                            </>
                        )}
                        {signUpField === "name" && (
                            <>
                                <label htmlFor="name" className="text-white font-bold text-2xl !mb-3"> Name </label>
                                <input 
                                    id="name" 
                                    type="text" 
                                    placeholder="Enter Name" 
                                    value={accountName} 
                                    onChange={(e) => {setAccountName(e.target.value); setFieldError("")}}
                                    className="!text-2xl !bg-amber-50/80 !rounded-lg !p-1 !mb-5"></input>
                                 <ErrorHint message={fieldError} />
                            </>
                        )}
                        {signUpField === "profilePicture" && (
                            <>
                                <p className="text-white font-bold text-2xl !mb-7">Upload Profile Picture</p>
                                {previewURL && (
                                <img
                                    src={previewURL}
                                    alt="Preview"
                                    style={{ width: '200px', height: 'auto', marginBottom: '1rem' }}
                                />
                                )}
                                
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        handleImageChange(e);
                                        setTempProfilePicture(e.target.files[0]);
                                    }}
                                 className="!mb-5 !block !w-full !text-sm !text-white
                                    !mr-4 !py-2 !px-4
                                    !rounded-full !border-0
                                    !font-semibold
                                    !bg-orange-300 !text-white
                                    !hover:bg-orange-400
                                    !cursor-pointer"
                                />
                                <ErrorHint message={fieldError} />

                            </>
                        )}
                        {signUpField === "password" ? (
                            <>
                                <label htmlFor="password" className="text-white font-bold text-2xl !mb-3"> Password </label>
                                <input 
                                    id="password" 
                                    type="password" 
                                    placeholder="Enter Password" 
                                    autoComplete="new-password"
                                    value={password} 
                                    onChange={(e) => {setPassword(e.target.value); setPasswordError("")}}
                                    className="!text-2xl !bg-amber-50/80 !rounded-lg !p-1 !mb-5"></input>
                                 <ErrorHint message={passwordError} />
                                <label htmlFor="confirmPassword" className="text-white font-bold text-2xl !mb-3"> Confirm Password </label>
                                <input 
                                    id="confirmPassword" 
                                    type="password" 
                                    placeholder="Confirm your Password" 
                                    value={confirmPassword} 
                                    onChange={(e) => {setConfirmPassword(e.target.value); setConfirmPasswordError("")}}
                                    className="!text-2xl !bg-amber-50/80 !rounded-lg !p-1 !mb-5"></input>
                                <ErrorHint message={confirmPasswordError} />
                                <button type="submit" className="!bg-amber-300 !mb-7 !mt-5 !rounded-2xl w-50 h-10 cursor-pointer !text-white !text-xl !font-bold">
                                    Submit
                                </button>
                            </>
                        ) :
                        (
                            <>
                                <button 
                                    type="button"
                                    onClick={async () => {
                                        if (signUpField === "profilePicture") {
                                            await handleProfilePicture();
                                            shiftingSignUpField(signUpField);
                                        } 
                                        else {
                                            shiftingSignUpField(signUpField);
                                        }
                                    }}
                                    className="!bg-green-200 !mb-7 !mt-5 !rounded-2xl w-50 h-10 cursor-pointer !text-white !text-xl !font-bold"
                                >
                                    Continue
                                </button>
                            </>
                        )}
                    </form>
                    <GoogleLogin type={"Sign Up"} changeUser={changeUser} router={router} />
                    <p className="text-blue-100 text-lg cursor-pointer font-bold text-center underline !mb-5" onClick={toLogin}> Login Instead </p>
                </div>
            </div>
        </>
    )
}

export default signUp