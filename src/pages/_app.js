import { useRouter } from 'next/router';
import { CurrentUserProvider } from  "../context/CurrentUserContext";
import { ReplyProvider } from '../context/ReplyContext';
import ProtectedRoute from '../components/ProtectedRoute';
import PublicRoute from '../components/PublicRoute';
import "../styles/Globals.css";


const protectedRoutes = ['/chat', '/dashboard']

export default function App({ Component, pageProps }) {
  // Check if the current route being accessed is a Protected Route
  const router = useRouter();
  const isProtected = protectedRoutes.some((route) =>
    router.pathname.startsWith(route)
  )

  // Check if the current route being accessed is Public Route, which is basically non protected routes
  const isPublic = !protectedRoutes.some((route) =>
    router.pathname.startsWith(route)
  )

  let page = <Component {...pageProps} />

  if (isProtected) {
    page = (
      <ProtectedRoute>
        {page}
      </ProtectedRoute>
    )
  }
  else if (isPublic) {
    page = (
      <PublicRoute>
        {page}
      </PublicRoute>
    )
  }

  return (
    <ReplyProvider>
      <CurrentUserProvider >
          {page}
      </CurrentUserProvider >
    </ReplyProvider>
  );
}