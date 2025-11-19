// Provides the Countdown from the current time to the target time
// Accepts input of the format: "2025-07-15"
import { useEffect, useState } from "react"

const useCountdown = (targetDateString) => {
    const [timeLeft, setTimeLeft] = useState("");

    useEffect(() => {
        if (!targetDateString) return;

        const targetDate = new Date(targetDateString);

        const interval = setInterval(() => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                setTimeLeft("Closed");
                clearInterval(interval);
                return;
            }

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((diff / (1000 * 60)) % 60);
            const seconds = Math.floor((diff / 1000) % 60);

            setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
        }, 1000)

        return () => clearInterval(interval);
    },[targetDateString])

    return timeLeft;
}

export default useCountdown;