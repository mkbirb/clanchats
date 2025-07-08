import { useCurrentUser } from "../context/CurrentUserContext";
import { usePresenceStatus } from "../customHooks/usePresenceStatus";
import { useRealtimePresence } from "../customHooks/useRealTimePresence";

export const UserPresenceTracking = () => {
  const { userID } = useCurrentUser();

  usePresenceStatus(userID);
  useRealtimePresence(userID);

  return null; 
};