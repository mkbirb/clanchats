import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";

export default function PublicRoute({children}) {
    const [loading, setLoading] = useState(true);

    const router = useRouter();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                // Redirect to Dashboard if user is signed in
                navigateTo(router, 'DASHBOARD');
            }
            else {
                setLoading(false);
            }
        })

        // Cleanup function
        return () => unsubscribe();
    }, [])

    if (loading) return <p>Loading...</p>;

    return (
        <>{children} </>
    )
}