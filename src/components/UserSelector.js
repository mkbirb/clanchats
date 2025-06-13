// Allows for the displaying of Usernames to help with the adding to the clan
import React, { useEffect, useState } from 'react';
import { searchUsers } from './firebaseConfig';

const UserSelector = ({ onAdd, selectedUsers }) => {
  const [input, setInput] = useState('');
  // For the username Suggestions and whether the Username Dropdown would be displayed
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Get the searching of Usernames when User begins to type to add individuals to the clan
    const fetch = async () => {
      if (input.trim()) {
        const results = await searchUsers(input);
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } 
      else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };
    fetch();
  }, [input]);

  const handleSelect = (user) => {
    // No longer display Username Suggestions List, once the Username has been selected
    onAdd(user);
    setInput('');
    setShowDropdown(false);
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Search usernames"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      { //Displaying of Username Suggestion List
        showDropdown && (
        <ul>
          {suggestions.map((user, index) =>
            // Dont suggest a Username that is already in the Clan Member List
            !selectedUsers.includes(user) ? (
              <li key={index} onClick={() => handleSelect(user)}>
                {user}
              </li>
            ) : null
          )}
        </ul>
      )}
    </div>
  );
};

export default UserSelector;
