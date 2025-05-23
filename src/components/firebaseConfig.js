import { db, auth} from '../firebase';
import {collection, getDocs, getDoc, setDoc, doc, addDoc, serverTimestamp, query, orderBy, where, onSnapshot, deleteDoc, updateDoc, increment, arrayRemove, arrayUnion } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { createServerSearchParamsForServerPage } from 'next/dist/server/request/search-params';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';

export const createMessage = async (text, userId, roomId, seen, imageUrl = null, replyTo = null, reactions = null) => {
    if ((text.length == 0) && (imageUrl == null)){
        // Prevents Empty Messages
        return;
    }

    try {
        // Add the Message to the Firestore
        await addDoc(collection(db, "rooms", roomId, "messages"), {
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
        console.log("Error creating the Message for: ", text, userId, roomId);
    }
};

export const retrieveMessages = (setMessages, roomID) => {
    // Refer to the correct collection
    const messagesRef = collection(db, "rooms", roomID, "messages");

    // Request to the database
    const records = query(
        messagesRef, 
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

export const deleteMessage = async (messageId, roomID) => {
    try {
        await deleteDoc(doc(db, "rooms", roomID, "messages", messageId));
        console.log("Message was able to be deleted")
    }
    catch(error) {
        console.log("Message deletion unsuccessful");
    }
}

export const editMessage = async (messageId, newText, roomID) => {
    // Updates the Message with the new text and the Date/Time the message was edited
    try {
        const messageRef = doc(db, "rooms", roomID, "messages", messageId);

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

export const createUser = async (email, username, accountName, password, profilePicture = null) => {
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
            profilePicture: profilePicture,
            onlineStatus: null,
            wordStatus: null,
            createdAt: new Date(),
        });

        return true;

      } 
      catch (error) {
        console.error("Signup error:", error.message);
        return false;
      }
}

export const signInWithGoogle = async () => {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;

        await saveGoogleUserToFirestore(user);

        return user;
    }
    catch(error) {
        console.log("Signup with Google Error: ", error.message);
        return false;
    }
}

export const saveGoogleUserToFirestore = async (user) => {
    try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if(!userSnap.exists()) {
            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    email: user.email,
                    username: user.displayName,
                    name: user.displayName,
                    profilePicture: user.photoURL || null,
                    onlineStatus: null,
                    wordStatus: null,
                    createdAt: new Date(),
                });

                console.log("New Google user added to Firestore");
                return true;
            } 
            else {
                console.log("Google user already exists in Firestore");
                return false;
            }
        }
    }
    catch (error) {
        console.error("Failed to save Google user to Firestore:", error.message);
        return false;
    }
}

export const retrieveGoogleAccountUser = async (email) => {
    try {
        const userRef = collection(db, "users");
        const emailQuery = query(userRef, where("email", "==", email));

        const emailQuerySnapshot = await getDocs(emailQuery);

        if (emailQuerySnapshot.empty) {
            // Email does not exist in Firestore, notify user or return error
            alert("Google Account not found");
            return null;
        }

        const userDoc = emailQuerySnapshot.docs[0];
        const userData = {
            id: userDoc.id,
            ...userDoc.data()
        };

        console.log("Retrieved Google Account user with ", userData);

        return userData;
    }
    catch (error) {
        console.error("Retrieve Google Account error: ", error.message);
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
        let userData;

        if (userDoc.exists()) {
          userData = { id: userDoc.id, ...userDoc.data() };
          user.username = userData.username;  
        }

        return userData;
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

// Get the Specific Users Document based on their Usernames
export const getSpecificUsersIDs = async (usernames) => {
    const usersIDList = [];
    
    for (const name of usernames) {
        const q = query(collection(db, "users"), where("username", "==", name));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const userDoc = snapshot.docs[0];
            usersIDList.push(userDoc.id);
        } 
        else {
            console.warn(`Username "${name}" not found in users collection.`);
        }
    }

    return usersIDList;
}

// Retrieves the User Document based on UserID
export const getUserByID = async(userID) => {
    const userRef = doc(db, "users", userID);

    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
        return {
            id: userSnapshot.id,      
            ...userSnapshot.data(),  
        };
    } 
    else {
        console.warn("No user found for the ID ", userID);
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

export const addReaction = async (messageId, userId, emoji, roomID) => {
    // Recall that the Reaction Field Structure is "😂": 2
    // While the UserReaction Field Structure is userId123: "😂"

    // Get the Message that we want to react too
    const messageRef = doc(db, "rooms", roomID, "messages", messageId);
    const messageSnapshot = await getDoc(messageRef);

    if (!messageSnapshot.exists()) {
        throw new Error("Message not found, so therefore cannot add new Reaction");
    }

    const data = messageSnapshot.data();
    const userReactions = data.userReactions || {};
    const existingReactions = userReactions[userId] || [];

    // Array is Array double confirms that Existing Reactions is an Array
    const hasReacted = Array.isArray(existingReactions) ? existingReactions.includes(emoji) : existingReactions === emoji;

    if (hasReacted) {
        console.log("User already reacted with this Emoji");

        // The Reaction is removed, if the Reaction is selected again
        await updateDoc(messageRef, {
            [`reactions.${emoji}`]: increment(-1),
            [`userReactions.${userId}`]: arrayRemove(emoji),

        })
        return;
    }
    else {
        // Track what Reactions are done by the User and increment the Reaction selected
        await updateDoc(messageRef, {
            [`reactions.${emoji}`]: increment(1),
            [`userReactions.${userId}`]: arrayUnion(emoji),
        })
    }
}

export const listenToReactions = (messages, onUpdate, roomID) => {
    const unsubscribers = [];
  
    messages.forEach((message) => {
      const messageRef = doc(db, "rooms", roomID, "messages", message.id);
  
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

export const getUserReactionsFromMessage = async (messageId, roomID, userId) => {
    const messageRef = doc(db, "rooms", roomID, "messages", messageId);
    const snap = await getDoc(messageRef);

     if (!snap.exists()) {
        console.log("No Messages exist for getting User Reactions from Message");
        return [];
     }

    const userReactions = snap.get(`userReactions.${userId}`);
    return Array.isArray(userReactions) ? userReactions : [userReactions];
}

export const logout = async () => {
    try {
        await signOut(auth);
        return true;
    }
    catch(error) {
        console.error("Logout error: ", error.message);
        return false;
    }
};

export const createClan = async (clanName, clanLogo, clanMembers, clanDescription) => {
    try {
        if (!clanName || !clanLogo || !clanMembers || !clanDescription) {
            alert("All fields are needed to create the Clan");
        }

        const docref = await addDoc(collection(db, "clan"), {
            name: clanName,
            logo: clanLogo,
            members: clanMembers,
            description: clanDescription,
            createdAt: serverTimestamp(),
            gallery: {},
            timetables: {},
            customEmojis: {}
        })
        

        // Return the ID of the Clan
        return docref.id;
    }
    catch(error) {
        alert("Error creating the Clan: " + error);
        console.log("Error creating the Clan for: ", clanName, clanLogo, clanMembers, clanDescription);
        return null;
    }
};

export const retrieveClan = async (clanID) => {
    try {
        if (!clanID) {
            console.log("ClanID is missing, so cannot retrieve Clan");
        }

        const clanRef = collection(db, "clan");
        
        // Get the Document that stores the Clan Information
        const clanQuery = query(clanRef, where("__name__", "==", clanID));
        const querySnapshot = await getDocs(clanQuery);

        if (querySnapshot.empty) {
            console.log("No clan found with the given ID");
            return null;
        }

        const clanDoc = querySnapshot.docs[0];
        return { id: clanDoc.id, ...clanDoc.data() };
    }
    catch(error) {
        console.log("Cannot Retrieve Clan: ", error);
        return null;
    }
}

export const createRoom = async (firstPersonID, secondPersonID) => {
    const roomRef = collection(db, "rooms");

    const firstPersonIDRef = doc(db, "users", firstPersonID);
    const secondPersonIDRef = doc(db, "users", secondPersonID);

    await addDoc(roomRef, {
        person1: firstPersonIDRef,  
        person2: secondPersonIDRef,  
        level: {level: 0, experience: 0},
        streak: 0,
        roomType: null,
        messages: [] 
    });
};

export const checkRoom = async(firstPersonID, secondPersonID) => {
    // Returns a Boolean to check whether a Room exists between two people.
    console.log("First Person is ", firstPersonID);
    console.log("Second Person is " , secondPersonID);
    
    const firstPersonRef = doc(db, "users", firstPersonID);
    const secondPersonRef = doc(db, "users", secondPersonID);

    const roomsRef = collection(db, "rooms");

    // Left is Person 1 first and then Right is Person 2
    const leftRight = query(
        roomsRef,
        where("person1", "==", firstPersonRef ),
        where("person2", "==", secondPersonRef)
    );

    // Right Left, where Second Person is first Person 1
    const rightLeft = query (
        roomsRef,
        where("person1", "==", secondPersonRef),
        where("person2", "==", firstPersonRef)
    )

    const [leftRightsnapshot, rightLeftsnapshot] = await Promise.all([
        getDocs(leftRight),
        getDocs(rightLeft),
    ]);

    const roomExists = !leftRightsnapshot.empty || !rightLeftsnapshot.empty;


    if (!roomExists) {
        console.log("No room found for these Users");
        return false;
    }
    else {
        return true;
    }
}

export const retrieveRoom = async(firstPersonID, secondPersonID) => {
    const firstPersonRef = doc(db, "users", firstPersonID);
    const secondPersonRef = doc(db, "users", secondPersonID);

    const roomsRef = collection(db, "rooms");

    const leftRight = query(
        roomsRef,
        where("person1", "==", firstPersonRef),
        where("person2", "==", secondPersonRef)
    );

    const rightLeft = query(
        roomsRef,
        where("person1", "==", secondPersonRef),
        where("person2", "==", firstPersonRef)
    );

    const [leftRightSnapshot, rightLeftsnapshot] = await Promise.all([
        getDocs(leftRight),
        getDocs(rightLeft),
    ]);

    const roomSnapshot = !leftRightSnapshot.empty ? leftRightSnapshot : !rightLeftsnapshot.empty ? rightLeftsnapshot : null;

    if (!roomSnapshot) {
        console.log("No room found for these Users");
        return null;
    }

    const roomDoc = roomSnapshot.docs[0];
    const roomData = {
        id: roomDoc.id,
        ...roomDoc.data()
    };

    const firstPersonSnapshot = await getDoc(roomData.person1);
    const secondPersonSnapshot = await getDoc(roomData.person2);

    if (!firstPersonSnapshot.exists() || !secondPersonSnapshot.exists()) {
        console.log("One or both users do not exist.");
        return null;
    }

    return {
        room: roomData,
        person1: firstPersonSnapshot.data(),
        person2: secondPersonSnapshot.data(),
    };
}

export const getClansBasedOnUser = async(userID) => {
    try {
        const clansRef = collection(db, "clan");

        const membersQuery = query(clansRef, where("members", "array-contains", userID));

        const snapshot = await getDocs(membersQuery);

        //Return the Document ID as well
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    }
    catch(error) {
        console.error("Failed to fetch clans user belongs to:", error);
        return [];
    }
}



