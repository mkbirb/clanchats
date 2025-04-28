import { db, auth} from '../firebase';
import {collection, getDocs, getDoc, setDoc, doc, addDoc, serverTimestamp, query, orderBy, where, onSnapshot, deleteDoc, updateDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

export const createMessage = async (text, userId, roomId, seen, imageUrl = null, replyTo = null) => {
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

export const logout = async () => {
    try {
        await signOut(auth);
    }
    catch(error) {
        console.error("Logout error: ", error.message);
    }
};


