import { retrieveGoogleAccountUser, signInWithGoogle } from "../components/firebaseConfig";
import { navigateTo } from "../components/Routes";
import { useCurrentUser } from "../context/CurrentUserContext";

// For Logging in Using Google Account

export const handleGoogleAccountSubmit = async (e, changeUser, router) => {
    e.preventDefault();

    const googleAccount = await signInWithGoogle();
    console.log("Google Account recieved ", googleAccount.email);

    const googleAccountUserData = await retrieveGoogleAccountUser(googleAccount.email);

    if(googleAccountUserData) {
        // Change to the respective Account stored
        changeUser(googleAccountUserData);
        navigateTo(router, "DASHBOARD");
    }
}   