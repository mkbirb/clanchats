// Prevents non signed in users to access signed in pages

import { useEffect, useState } from "react";
import { useRouter } from 'next/router'
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useCurrentUser } from "../context/CurrentUserContext";
import { getUserByID  } from "./firebaseConfig";
import { navigateTo } from "./Routes";

export default function ProtectedRoute({children}) {
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    const { user, changeUser } = useCurrentUser();

      useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        if (firebaseUser) {
            // If user not already loaded in context
            if (!user) {
            const userData = await getUserByID(firebaseUser.uid); 
            if (userData) {
                changeUser(userData); 
            }
            }
        } else {
            // Not logged in, redirect to login
            navigateTo(router, 'LOGIN');
        }
        setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) return (
        <>
            <p> Loading...</p>
        </>
    )

    

    return <> {children} </>
}