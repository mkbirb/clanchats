import { CurrentUserProvider } from  "../context/CurrentUserContext";

export default function App({ Component, pageProps }) {
  return (
    <CurrentUserProvider >
      <Component {...pageProps} />
    </CurrentUserProvider >
  );
}