import { db, auth, rtdb} from '../firebase';
import {collection, getDocs, getDoc, setDoc, doc, addDoc, serverTimestamp, query, orderBy, where, onSnapshot, deleteDoc, updateDoc, increment, arrayRemove, arrayUnion, Timestamp, startAfter, limit } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, getAuth, signInWithPopup, GoogleAuthProvider} from "firebase/auth";
import { createServerSearchParamsForServerPage } from 'next/dist/server/request/search-params';
import { error } from 'ajv/dist/vocabularies/applicator/dependencies';
import { levelDefinition, maxLevel } from './definitions/LevelDefinitions';
import { child, off, onValue, ref } from 'firebase/database';

// Used for User Caching
const userCache = new Map();

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
            seenBy: seen,
            // DeliveredTo helps indicate that the Message has been recieved by the recipient device
            deliveredTo: null,
            imageURL: imageUrl,
            replyTo: replyTo,
            reactions: {},
            // Stores which Emoji has been reacted to by which User
            userReactions: {},
            reactionsOrder: [],
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
            setMessages([]);
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
            // Presence is automatically set by the app to help determine whether the User has gotten offline
            presence: "online",
            lastActive: serverTimestamp(),
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

// Get the Specific Users Document based on their Usernames. Can also accept single usernames
export const getSpecificUsersIDs = async (usernames) => {
    const usersIDList = [];

    // Allows acceptance of Single Username or Array of Usernames
    const names = Array.isArray(usernames) ? usernames : [usernames];
    
    for (const name of names) {
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
export const getUserByID = async (userID) => {
    if (!userID) {
        console.warn("getUserByID called with invalid ID:", userID);
        return null;
    }

    const userRef = doc(db, "users", userID);
    const userSnapshot = await getDoc(userRef);

    if (userSnapshot.exists()) {
        return {
            id: userSnapshot.id,
            ...userSnapshot.data(),
        };
    } else {
        console.warn("No user found for the ID", userID);
        return null;
    }
};


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
    // Helps ensure that the Emojis dont change order when a new Reaction is added
    const reactionsOrder = data.reactionsOrder || [];

    // Array is Array double confirms that Existing Reactions is an Array
    const hasReacted = Array.isArray(existingReactions) ? existingReactions.includes(emoji) : existingReactions === emoji;

    if (hasReacted) {
        console.log("User already reacted with this Emoji");

        // The Reaction is removed, if the Reaction is selected again
        removeReaction(messageId, userId, emoji, roomID);
    }
    else {
        // Track what Reactions are done by the User and increment the Reaction selected
        const updates = {
            [`reactions.${emoji}`]: increment(1),
            [`userReactions.${userId}`]: arrayUnion(emoji),
        }

        if (!reactionsOrder.includes(emoji)) {
            updates.reactionsOrder = arrayUnion(emoji);
        }

        await updateDoc(messageRef, updates);
    }
}

export const removeReaction = async (messageId, userId, emoji, roomID) => {
    const messageRef = doc(db, "rooms", roomID, "messages", messageId);
    const messageSnapshot = await getDoc(messageRef);

    if (!messageSnapshot.exists()) {
        throw new Error("Message not found, cannot remove reaction");
    }

    const data = messageSnapshot.data();
    const currentCount = data.reactions?.[emoji] || 0;

    const updates = {
            [`reactions.${emoji}`]: increment(-1),
            [`userReactions.${userId}`]: arrayRemove(emoji),

    };

    //  If the Reaction WILL hit 0, than remove the reaction from the Reactions Order List
    if (currentCount <= 1 && Array.isArray(data.reactionsOrder)) {
        updates.reactionsOrder = arrayRemove(emoji);
    }

    await updateDoc(messageRef, updates);
}

export const listenToReactions = (roomID, onUpdate) => {
    const messagesCollectionRef = collection(db, "rooms", roomID, "messages")
  
  
    const unsubscribe = onSnapshot(messagesCollectionRef, (snapshot) => {
        snapshot.docChanges().forEach(change => {
            const docData = change.doc.data();
            const messageID = change.doc.id;
            
            // Only do live updates for the specific Message that has its Reactions changed
            if (docData.reactions) {
                onUpdate(messageID, docData.reactions);
            }
        })
    });

    return unsubscribe;
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
            slides: [],
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

export const retrieveRoomBasedOnID = async(roomID) => {

    try {
        if (!roomID) {
            console.log("Room ID was not given");
        }

        const roomRef = doc(db, "rooms", roomID);

        const snap = await getDoc(roomRef);

        if (!snap.exists()) {
            console.log("No room found with the given ID");
            return null;
        }

        return { id: snap.id, ...snap.data() };
    }
    catch (error) {
        console.log("Cannot find the Room based on Room ID", roomID);

        return null;
    }
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

export const incrementRoomExperience = async (roomID, amount = 0) => {

    if(!roomID) {
        console.log("No Room ID given for Incrementing Room Experience");
        return;
    }

    try {
        const roomRef = doc(db, "rooms", roomID);

        const roomSnapshot = await getDoc(roomRef);

        const roomData = roomSnapshot.data();

        const currentLevel = roomData.level.level;
        const currentExperience = roomData.level.experience;

        let newExperience = currentExperience + amount;
        let newLevel = currentLevel;

        // Only Level up, when you have not reached maxed level
        while((newLevel < maxLevel) && (newExperience >= levelDefinition[newLevel])) {
            newExperience -= levelDefinition[newLevel];
            newLevel++;
        }

        // Cap the Experience to the Max
        if (newLevel === maxLevel && newExperience > levelDefinition[maxLevel]) {
            newExperience = levelDefinition[maxLevel];
        }

        await updateDoc(roomRef, {
            "level.level": newLevel,
            "level.experience": newExperience,
        })
    }
    catch (error) {
        console.error("Error incrementing experience for Room: ", error);
    }
}

// Allows for active listening to the Room Data
export const subscribeToRoomData = (roomID, callback) => {
    const roomRef = doc(db, "rooms", roomID);

    return onSnapshot(roomRef, (snapshot) => {
        if (snapshot.exists()) {
        callback(snapshot.data());
        }
    });
};

export const updateOnlineStatus = async (userID, onlineStatus) => {
    const userRef = doc(db, "users", userID);

    try {
        await updateDoc(userRef, {
            onlineStatus: onlineStatus,
        })
    }
    catch (error) {
        console.log("Cannot update Online Status due to ", error);
    }
}

export const updateWordStatus = async (userID, wordStatus) => {
   const userRef = doc(db, "users", userID);

    try {
        await updateDoc(userRef, {
            wordStatus: wordStatus,
        })
    }
    catch (error) {
        console.log("Cannot update Word Status due to ", error);
    }
}

export const updateProfilePicture = async (userID, profilePicture) => {
   const userRef = doc(db, "users", userID);

    try {
        await updateDoc(userRef, {
            profilePicture: profilePicture,
        })
    }
    catch (error) {
        console.log("Cannot update Profile Picture due to ", error);
    }
}

export const searchMessages = async (roomID, {username, startDate, endDate, searchInput}) => {
    const messagesRef = collection(db, "rooms", roomID, "messages");

    let q = query(messagesRef);

    if (username) {
        const userIDs = await getSpecificUsersIDs(username); 

        if (userIDs.length > 0) {
            if (userIDs.length === 1) {
                q = query(q, where("userID", "==", userIDs[0]));
            } 
        } else {
            // No valid users = no results
            return [];
        }
    }

    if (startDate) {
        // If start date is given, then query
        q = query(q, where("createdAt", ">=", Timestamp.fromDate(new Date(startDate))));
    }

    if (endDate) {
        // Create date for the end of the day to include all messages on that day
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999); 
        
        q = query(q, where("createdAt", "<=", Timestamp.fromDate(end)));
    }

    // We just getting exact messages and input starters
    if (searchInput && searchInput.trim() !== "") {
        q = query(q, 
            where('text', '>=', searchInput), 
            where('text', '<=', searchInput + '\uf8ff'));
    }

    const snapshot = await getDocs(q);

    const results = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }))

    return results;
}

// Keeps track of which Replies that the User has choosen to not reply to and remove from the Reply List
export const addRemovedReplyListMessageID = async (roomID, userID, messageID) => {
    const docRef = doc(db, "rooms", roomID, "removedReplyMessageIDs", userID);

    await updateDoc(docRef, {
        // Add the Messsage without duplicates
        removedIDs: arrayUnion(messageID)
    }).catch(async (error) => {
        if (error.code === 'not-found') {
            // If document doesn't exist, create it
            await setDoc(docRef, { removedIDs: [messageID] });
        } 
        else {
            console.log("Cannot add the Message to remove from the Reply List ", error);
        }
    });
}

export const getUnRepliedMessages = async (roomID, currentUserID) => {
    const messageRef = collection(db, "rooms", roomID, "messages");

    // Get the Last Messages from 14 Days
    const q = query(messageRef, where("createdAt", ">=", Timestamp.fromDate(new Date(Date.now() - 14 * 24 * 60 * 60 * 1000))));

    const messageSnapshot = await getDocs(q);

    // Also include the Document IDs of each of the Messages retrieved
    const allMessages = messageSnapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));

    // Get removed message IDs for the current user
    const removedDocRef = doc(db, "rooms", roomID, "removedReplyMessageIDs", currentUserID);
    const removedDocSnap = await getDoc(removedDocRef);
    const removedIDs = removedDocSnap.exists() ? removedDocSnap.data().removedIDs || [] : [];

    // Get all of the Original Messages that is not from the Current Users ID
    const originalMessageFromOther = allMessages.filter(message => message.userID != currentUserID && !message.replyTo);

    const currentUserReplies = allMessages.filter(message => message.userID === currentUserID && message.replyTo);

    // Filter out the repeated replies, different Messages might have by using Set
    const repliedToIDs = new Set(currentUserReplies.map(msg => msg.replyTo));

    // Filter Messages based on what Users has not replied too

    const unrepliedMessages = originalMessageFromOther.filter(
        msg => !repliedToIDs.has(msg.id) && !removedIDs.includes(msg.id)
    )

    // Only retrieve unreplied Messages that are longer than 3 Words
    const longUnrepliedMessages = unrepliedMessages.filter(
        msg => msg.text && msg.text.trim().split(/\s+/).length >= 3
    );

    return longUnrepliedMessages;
}

export const createCustomClanEmoji = async (clanID, emojiName, keywords, imageUrl) => {
    const emojiRef = collection(db, "clan", clanID, "customEmojis");

    await addDoc(emojiRef, {
        id: emojiName.toLowerCase(),
        name: emojiName,
        shortcodes: [emojiName.toLowerCase()],
        keywords: keywords.split(",").map(k => k.trim().toLowerCase()),
        skins: [{ src: imageUrl }],
    })
}

export const getCustomClanEmojis = async (clanID) => {
    const emojiRef = collection(db, "clan", clanID, "customEmojis");
    const emojiSnapshot = await getDocs(emojiRef);

    const emojis = emojiSnapshot.docs.map((doc) => ({id: doc.id, ...doc.data()}));

    return emojis;
}

export const getPaginatedMembers = async (clanID, pageSize, currentPage) => {
    const clanRef = doc(db, "clan", clanID);
    const clanSnap = await getDoc(clanRef);

    if (!clanSnap.exists()) {
        console.warn("Clan not found:", clanID);
        return { docs: [], isLastPage: true };
    }

    const membersArray = clanSnap.data().members || [];

    // Calculate pagination slice
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const pagedUserIDs = membersArray.slice(startIndex, endIndex);

    // Fetch user data for these userIDs
    const members = await Promise.all(
        pagedUserIDs.map(async (userID) => {
            const userData = await getUserByID(userID);
            return userData || { id: userID, name: "Unknown" };
        })
    );

    // Determine if last page
    const isLastPage = endIndex >= membersArray.length;

    return {
        docs: members,
        isLastPage,
    };
};



export const removeClanMember = async (clanID, userID) => {
    const clanRef = doc(db, "clan", clanID);

    await updateDoc(clanRef, {
        members: arrayRemove(userID),
    });

    console.log(`User ${userID} removed from clan ${clanID}`);
}

export const addClanMember = async (clanID, userID) => {
    const clanRef = doc(db, "clan", clanID);

    await updateDoc(clanRef, {
        members: arrayUnion(userID)
    })
}

export const saveClanSlides = async(clanID, uploadedURLs) => {
      console.log("clanID:", clanID);
    const clanRef = doc(db, "clan", clanID);

    await updateDoc(clanRef, {
        slides: uploadedURLs
    });
}

export const getClanSlides = async(clanID) => {
    const clanRef = doc(db, "clan", clanID);

    const clanSnap = await getDoc(clanRef);

    if (clanSnap.exists()) {
        const data = clanSnap.data();
        
        return data.slides || [];
    }
    else {
        console.error("No such clan document, so cannot retrieve Clan Slides!");

        return [];
    }
}

export const getClanCalenderEvents = async (clanID) => {
  const calenderRef = collection(db, "clan", clanID, "calender");
  const snapshot = await getDocs(calenderRef);

  if (!snapshot.empty) {
    const docs = snapshot.docs.map(doc => {
      const data = doc.data();

      const startDate = data.startDate; 
      const endDate = data.endDate || startDate;

      return {
        id: doc.id,
        title: data.title || "(No Title)",
        description: data.description || "",
        start: startDate,
        end: endDate,
        type: data.type || "",
      };
    });

    return docs;
  } else {
    console.error("Clan Calendar cannot be retrieved");
    return [];
  }
};


export const createClanCalenderEvent = async(clanID, title, startDate, endDate, description, type) => {
    try {
        const calenderRef = collection(db, "clan", clanID, "calender");

        await addDoc(calenderRef, {
            title: title,
            startDate: startDate,
            endDate: endDate,
            description: description || "",
            type: type,
            createdAt: new Date(),
        });

        console.log("Calendar event added successfully.");
    }
    catch (error) {
        console.error("Failed to create clan event: ", error);
    }
}

export const updateClanCalenderEvent = async(clanID, eventID, title, startDate, endDate, description, type) => {
    const eventRef = doc(db, "clan", clanID, "calender", eventID)

    await updateDoc(eventRef, {
        title: title,
        startDate: startDate,
        endDate: endDate,
        description: description,
        type: type,
    })
}

export const deleteClanCalenderEvent = async (clanID, eventID) => {
  const eventRef = doc(db, "clan", clanID, "calender", eventID);
  await deleteDoc(eventRef);
};

export const createClanAnnouncements = async (clanID, title, description, type, banner, attachments) => {
    const announcementsRef = collection(db, "clan", clanID, "announcements");

    await addDoc(announcementsRef, {
        title: title,
        description: description,
        type: type,
        banner: banner,
        attachments: attachments,
        createdAt: new Date(),
        editedAt: null,
    })
}

export const retrieveClanAnnoucements = async (clanID) => {
    const announcementsRef = collection(db, "clan", clanID, "announcements");

    const snapshot = await getDocs(announcementsRef);

    if (!snapshot.empty) {
      const docs = snapshot.docs.map(doc => {
      const data = doc.data();

      return {
        id: doc.id, ...data
      };
    });

    return docs;
  } 
  else {
    console.error("Clan Annoucements cannot be retrieved");
    return [];
  }
}

export const editClanAnnoucements = async (clanID, announcementsID, title, description, type, banner, attachments) => {
    const announcementRef = doc(db, "clan", clanID, "announcements", announcementsID);
    const snapshot = await getDoc(announcementRef);
    const originalData = snapshot.data();

    await updateDoc(announcementRef, {
        title: title,
        description: description,
        type: type,
        banner: banner,
        attachments: attachments,
        createdAt: originalData.createdAt ?? new Date(),
        editedAt: new Date(),
    })
}

export const deleteClanAnnoucement = async (clanID, announcementsID) => {
    const announcementRef = doc(db, "clan", clanID, "announcements", announcementsID);

    await deleteDoc(announcementRef);
}

export const createTimetable =  async (clanID, title, date, startTime, endTime, price, bringItems, additionalNotes) => {
    const timetableRef = collection(db, "clan", clanID, "timetables");

    await addDoc(timetableRef, {
        title: title,
        date: date,
        startTime: startTime,
        endTime: endTime,
        price: price,
        bringItems: bringItems,
        additionalNotes: additionalNotes,
        createdAt: serverTimestamp(),
    })
};

export const retrieveAllClanTimetables = async (clanID) => {
  const timetablesRef = collection(db, "clan", clanID, "timetables");
  const timetableDocs = await getDocs(timetablesRef);

  const timetables = timetableDocs.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return timetables;
};

export const retrieveClanTimetable = async (clanID, timetableID) => {
    const timetablesRef = doc(db, "clan", clanID, "timetables", timetableID);
    const snapshot = await getDoc(timetablesRef);

    if (!snapshot.exists()) {
        console.warn("Timetable not found");
        return null;
    }

    return { id: snapshot.id, ...snapshot.data() };
}

export const createTimetableTask = async (clanID, title, duration, description) => {
    if (!clanID) throw new Error("clanID is missing");

    const taskRef = collection(db, "clan", clanID, "tasks");

    await addDoc(taskRef, {
        title: title,
        duration: duration,
        description: description,
        // Task can belong to a specific Clan, so need to refer to it
        clanRef: clanID,
    });
}

export const deleteTimetableTask = async (clanID, taskID) => {

    const taskRef = doc(db, "clan", clanID, "tasks", taskID);

    await deleteDoc(taskRef);

}

// Returns all of the Global Tasks belonging to the specific clan
export const retrieveAllTimetableTasks = async (clanID) => {
    const taskRef = collection(db, "clan", clanID, "tasks");
    const snapshot = await getDocs(taskRef);

    const tasks = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    return tasks;
}

// Only fetch user if it has not been cached
export async function getCachedUserByID(uid) {
  if (userCache[uid]) return userCache[uid];

  const userDoc = await getDoc(doc(db, 'users', uid));
  if (userDoc.exists()) {
    const data = userDoc.data();
    userCache[uid] = data;
    return data;
  }

  return null;
}

export const startTyping = async (roomID, currentUser) => {

    const typingRef = doc(db, "rooms", roomID, "typing", currentUser.id);

    await setDoc(typingRef, {
        userID: currentUser.id,
        displayName: currentUser.name,
        timestamp: serverTimestamp()
    })
}

export const stopTyping = async (roomID, currentUserID) => {
    const typingRef = doc(db, "rooms", roomID, "typing", currentUserID);

    await deleteDoc(typingRef);
}


let lastWrittenPresence = null;
let lastPresenceWriteTime = 0;

export const updateUserPresence = async (presence, userID) => {
  const now = Date.now();

  // Throttle writes within 5 seconds
  if (lastPresenceWriteTime && now - lastPresenceWriteTime < 5000) return;

  // Avoid writing if presence is unchanged
  if (presence === lastWrittenPresence) return;

  lastPresenceWriteTime = now;
  lastWrittenPresence = presence;

  const userRef = doc(db, "users", userID);
  await updateDoc(userRef, {
    presence,
    lastActive: serverTimestamp(),
  });
};

export const subscribeToUserPresenceAndStatus = (userId, callback) => {
  const userRef = doc(db, "users", userId);

  const unsub = onSnapshot(userRef, (docSnap) => {
    if (docSnap.exists()) {
      const data = docSnap.data();
      const presence = data.presence || "offline";
      const status = data.onlineStatus || "online";
      callback({ presence, status });
    }
  });

  return unsub; 
};

export const updateUserPresenceWithBeacon = (presence, userID) => {
    const userRefPath = `users/${userID}`;
    const payload = JSON.stringify({
        presence,
        lastActive: Date.now(),
    });

    // Beacon is used, so the data is being sent and not getting canceled when the Tab closes
    navigator.sendBeacon(
        `/api/presence-update?path=${encodeURIComponent(userRefPath)}`,
        payload
    );
}

export const isUsernameTaken = async (username) => {

    const userRef = collection(db, "users");

    // Case Sensitive does not apply
    const q = query(userRef, where("username", "==", username));

    const querySnapshot = await getDocs(q);

    return !querySnapshot.empty;
}

export const isEmailTaken = async (email) => {
    const userRef = collection(db, "users");

    const q = query(userRef, where("email", "==", email.toLowerCase()));

    const querySnapshot = await getDocs(q);
    return !querySnapshot.empty;
}

export const createPoll = async (question, options, multipleVotesAllowed, closedDate, userID, clanID) => {
    const pollRef = collection(db, "clan", clanID, "polls");

    await addDoc(pollRef, {
        question: question,
        options: options,
        allowMultipleVotes: multipleVotesAllowed,
        isOpen: true,
        closedDate: closedDate,
        createdBy: userID,
        createdAt: serverTimestamp(),
        voters: {},
        voteCounts: {}
    })
}

export const voteOnPoll = async (clanID, pollID, userID, selectedOptions) => {
    const pollRef = doc(db, "clan", clanID, "polls", pollID);

    const pollSnap = await getDoc(pollRef);

    if (!pollSnap.exists()) return;

    const poll = pollSnap.data();
    const prevVotes = poll.voters?.[userID] || [];

    // Only update if the Vote has changed
    const sameVote = prevVotes.length === selectedOptions.length && prevVotes.every(v => selectedOptions.includes(v))
    if (sameVote) return;

    const voteCounts = {
        ...(poll.voteCounts || {})
    };

    // Subtract the counts for the old votes, if the new votes after the user changes dont include that vote anymore
    for (const option of prevVotes) {
        if (voteCounts[option] !== undefined) {
            voteCounts[option] = Math.max(0, voteCounts[option] - 1);
        }
    }

    // Add the new vote counts to each of the options
    for (const option of selectedOptions) {
        voteCounts[option] = (voteCounts[option] || 0) + 1;
    }

    if (poll.allowMultipleVotes == false) {
        if (selectedOptions.length > 1) {
            console.log("Only one vote is allowed");

            return null;
        }
    }

    await updateDoc(pollRef, {
        [`voters.${userID}`]: selectedOptions,
        voteCounts,
        lastVotedAt: serverTimestamp()
    });
}

export const retrievePolls = (clanID, callback) => {
    const pollRef = collection(db, "clan", clanID, "polls");
    const unsubscribe = onSnapshot(pollRef, (snapshot) => {
        const polls = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        callback(polls);
    });


    return unsubscribe;
}

export const deletePoll = async (pollID, clanID) => {
    await deleteDoc(doc(db, "clan", clanID, "polls", pollID));
}

// Closes Poll to prevent any new votes for being cast for that poll
export const closePoll = async (clanID, pollID) => {
    const pollRef = doc(db, "clan", clanID, "polls", pollID);

    await updateDoc(pollRef, {
        isOpen: false,
    });
}

export const subscribeToPoll = (pollID, clanID, callback) => {
    const pollRef = doc(db, "clan", clanID, "polls", pollID);
    return onSnapshot(pollRef, (snap) => {
        if (snap.exists()) callback({ id: snap.id, ...snap.data() });
    });
};

export const listenToOnlineCountForClan = (clanMembersID, callback) => {
    const statusRef = ref(rtdb, "/status");

    console.log("we haveee", statusRef);

    const handleValue = (snapshot) => {
        console.log("status snapshot received");
        let count = 0;

        snapshot.forEach(child => {
            const userID = child.key;
            const { state } = child.val();

            // Count Clan Members who are Online or Idle
            if (clanMembersID.includes(userID) && (state === "online" || state === "idle")) {
                count++;
            }
        });

        console.log("count total:", count);

        callback(count);
    };

    // Register the listener
    const unsubscribe = onValue(statusRef, handleValue);

    // Cleanup listener on unmount
    return unsubscribe;
};

export const saveMemoryBoard = (clanID, user, boardID, elements, appState, files) => {
    const memoryBoard = doc(db, "clan", clanID, "memoryboards", boardID);
    console.log("clanID", clanID);
    console.log("boardid", boardID);
    console.log("user", user);

    // Store the contents of the Memory Board as a String
    setDoc(memoryBoard, {
        elements: JSON.stringify(elements ?? []), 
        appState: JSON.stringify(appState ?? {}),
        files: JSON.stringify(files ?? {}),
        updatedAt: serverTimestamp(),
        updatedBy: user?.uid || null,
    });
}

export const loadMemoryBoard = async (clanID, boardID) => {
  const memoryBoard = doc(db, "clan", clanID, "memoryboards", boardID);
  const snapshot = await getDoc(memoryBoard);

  if (snapshot.exists()) {
    const data = snapshot.data();

    // Revert back the contents of the Memory Board
    const elements = JSON.parse(data.elements);  
    const appState = JSON.parse(data.appState);
    const files = JSON.parse(data.files);

    return { elements, appState, files };
  }
};