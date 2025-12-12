import { useState } from "react";

export function usePopupNotification(timeout = 1500) {
  const [message, setMessage] = useState(null);

  const showPopup = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), timeout);
  };

  const Popup = () => {
    if (!message) return null;
    return (
      <div className="fixed top-5 left-1/2 text-lg !p-2 font-bold -translate-x-1/2 bg-black text-white px-4 py-2 rounded-xl z-50 animate-fade-in-out">
        {message}
      </div>
    );
  };

  return { showPopup, Popup };
}