// Allows for you to fetch the Custom Emojis

import { useEffect, useState } from 'react';
import { getCustomClanEmojis } from '../components/firebaseConfig';

const useCustomEmojis = (clanId) => {
  const [customEmojis, setCustomEmojis] = useState([]);

  useEffect(() => {
    const fetchCustomEmojis = async () => {
      try {
        const fetchedEmojis = await getCustomClanEmojis(clanId);
        setCustomEmojis(fetchedEmojis || []);
      } 
      catch (error) {
        console.log("Custom Emojis cannot be fetched for Emoji Picker ", error);
      } 
    };

    if (clanId) {
      fetchCustomEmojis();
    }
  }, [clanId]);

  return { customEmojis };
};

export default useCustomEmojis;