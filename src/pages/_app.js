import { CurrentUserProvider } from  "../context/CurrentUserContext";
import { ReplyProvider } from '../context/ReplyContext';
import "../styles/Globals.css";

export default function App({ Component, pageProps }) {
  return (
    <ReplyProvider>
      <CurrentUserProvider >
          <Component {...pageProps} />
      </CurrentUserProvider >
    </ReplyProvider>
  );
}