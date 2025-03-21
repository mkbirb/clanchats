import { CurrentUserProvider } from  "../context/CurrentUserContext";
import "../styles/Globals.css";

export default function App({ Component, pageProps }) {
  return (
    <CurrentUserProvider >
      <Component {...pageProps} />
    </CurrentUserProvider >
  );
}