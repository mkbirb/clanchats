import { db, auth} from '../firebase';
import {collection, getDocs, getDoc, setDoc, doc, addDoc, serverTimestamp, query, orderBy, where, onSnapshot, deleteDoc, updateDoc, increment, deleteField } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { createServerSearchParamsForServerPage } from 'next/dist/server/request/search-params';

export const createMessage = async (text, userId, roomId, seen, imageUrl = null, replyTo = null, reactions = null) => {
    if ((text.length == 0) && (imageUrl == null)){
        // Prevents Empty Messages
        return;
    }

    try {
        // Add the Message to the Firestore
        await addDoc(collection(db, "messages"), {
            // Define the Document Model
            text: text,
            userID: userId,
            roomID: roomId,
            createdAt: serverTimestamp(),
            editedAt: null,
            seen: seen,
            imageURL: imageUrl,
            replyTo: replyTo,
            reactions: {},
            // Stores which Emoji has been reacted to by which User
            userReactions: {}
        });
        console.log("Sent Message");
    }
    catch(error) {
        alert("Error creating the Message: " + error);
        console.log("Error creating the Message for: ", text, userId, roomId, createdAt, seen);
    }
};

export const retrieveMessages = (setMessages, roomID) => {
    // Refer to the correct collection
    const messagesRef = collection(db, "messages");

    // Request to the database
    const records = query(
        messagesRef, 
        where("roomID", "==", roomID),
        orderBy("createdAt", "asc")
    );

    // Onsnapshot returns an Unsubscribe function, despite subscribing to changes in the database itself.
    const unsubscribe = onSnapshot(records, (snapshot) => {

        if (snapshot.empty) {
            console.log("No messages found for room", roomID);
        }
        else {
            const messageData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            }));
    
            // Update the State
            setMessages(messageData);
        }
    }, (error) => {
        // Handle potential errors
        console.error("Error fetching messages:", error);
    });

    return unsubscribe;
    
}

export const deleteMessage = async (messageId) => {
    try {
        await deleteDoc(doc(db, "messages", messageId));
        console.log("Message was able to be deleted")
    }
    catch(error) {
        console.log("Message deletion unsuccessful");
    }
}

export const editMessage = async (messageId, newText) => {
    // Updates the Message with the new text and the Date/Time the message was edited
    try {
        const messageRef = doc(db, "messages", messageId);

        const messageSnapshot = await getDoc(messageRef);
        
        if (messageSnapshot.exists()) {
            // Get the Current Text from the Message
            const currentText = messageSnapshot.data().text;
            // Only update the Message stored in the Database, if the New Text is actualy differenrt
            // To the Text being stored
            if (currentText !== newText) {
                await updateDoc(messageRef, {
                    text: newText,
                    editedAt: Date.now()
                })
                console.log("Message was edited");
            }
            else {
                console.log("Message was the same, so no point of editing");
            }
        }
        else {
            console.log("Message cannot be found");
        }
    }
    catch(error) {
        console.log("Message cannot be edited");
    }
}

export const createUser = async (email, username, accountName, password) => {
    try {

        if (!email || !username || !accountName || !password) {
            alert("All fields are required!");
            return false;
        }

        console.log("All fields are present, continuing execution...");

        // Check whether the Username already exists.
        const userRef = collection(db, "users");
        const userNameQuery = query(userRef, where("username", "==", username));
        const emailQuery = query(userRef, where("email", "==", email));
        const emailQuerySnapshot = await getDocs(emailQuery);
        const usernameQuerySnapshot = await getDocs(userNameQuery);

        if (!emailQuerySnapshot.empty) {
            alert("Email is already in use. Please choose another email.");
            return false;
        }

        if (!usernameQuerySnapshot.empty) {
            alert("Username is already taken.");
            return false;
        }

        // Minimum 6 characters, at least one letter, one number, and one special character
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 6 characters long and include at least one letter, one number, and one special character.");
            return false;
        }

        // Create the User, if Username does not exist yet in database
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await setDoc(doc(db, "users", user.uid), {
            email: email,
            username: username,
            name: accountName,
            createdAt: new Date(),
        });

        return true;

      } 
      catch (error) {
        console.error("Signup error:", error.message);
        return false;
      }
}

export const retrieveUser = async (email, password) => {
    try {
        const userRef = collection(db, "users");
        const emailQuery = query(userRef, where("email", "==", email));
        const emailQuerySnapshot = await getDocs(emailQuery);

        if (emailQuerySnapshot.empty) {
            // Email does not exist in Firestore, notify user or return error
            alert("Email not found, maybe Signup Instead.");
            return null;
        }

        if (!email || !password) {
            alert("All fields are required!");
            return null;
        }

        // Attempt to Sign In with Valid Email
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Add the Username to the User Object
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          user.username = userData.username;  
        }

        return user;
    } 
    catch (error) {
        console.error("Login error: ", error.message);

        if (error.code === "auth/invalid-credential") {
            alert("Incorrect password. Please try again.");
        } 
        else {
            alert("An error occurred during login. Please try again later.");
        }

        return null;
    }
}

// Search for users in the Firestore that begin with the Input
export const searchUsers = async (input) => {
    if (input.trim() === '') return [];

    // Search in the Firestore
    const q = query(
        collection(db, "users"),
        // Range that returns all of the Usernames that start with the Input String
        where('username', '>=', input),
        where('username', '<=', input + '\uf8ff')
    );

    const querySnapshot = await getDocs(q);

    const searchList = [];

    // Store each of the Usernames found in the list
    querySnapshot.forEach(doc => {
        searchList.push(doc.data().username);
    })

    return searchList;
}

export const addReaction = async (messageId, userId, emoji) => {
    // Recall that the Reaction Field Structure is "😂": 2
    // While the UserReaction Field Structure is userId123: "😂"

    // Get the Message that we want to react too
    const messageRef = doc(db, "messages", messageId);
    const messageSnapshot = await getDoc(messageRef);

    if (!messageSnapshot.exists()) {
        throw new Error("Message not found, so therefore cannot add new Reaction");
    }

    const data = messageSnapshot.data();
    const userReactions = data.userReactions || {};

    if (userReactions[userId] === emoji) {
        console.log("User already reacted with this Emoji");

        // The Reaction is removed, if the Reaction is selected again
        await updateDoc(messageRef, {
            [`reactions.${emoji}`]: increment(-1),
            [`userReactions.${userId}`]: deleteField(),

        })
        return;
    }
    else {
        // Track what Reactions are done by the User and increment the Reaction selected
        await updateDoc(messageRef, {
            [`reactions.${emoji}`]: increment(1),
            [`userReactions.${userId}`]: emoji
        })
    }
}

export const listenToReactions = (messages, onUpdate) => {
    const unsubscribers = [];
  
    messages.forEach((message) => {
      const messageRef = doc(db, "messages", message.id);
  
      const unsubscribe = onSnapshot(messageRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Update the Message with the Reaction Emoji and its Counts
          onUpdate(message.id, data.reactions || {});
        }
      });
  
      unsubscribers.push(unsubscribe);
    });
  
    // Return a function to unsubscribe all
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  };

export const logout = async () => {
    try {
        await signOut(auth);
    }
    catch(error) {
        console.error("Logout error: ", error.message);
    }
};


