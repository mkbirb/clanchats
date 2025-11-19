// Gets the time from FirestoreTimestamp like "June 20, 2025 at 6:48:08 PM UTC+10"
// To then 6:48 pm

export function getTimeFromFirestoreTimestamp (input) {
    if (!input) return "";

    let date;

    // Firestore Timestamp
    if (typeof input.toDate === "function") {
        date = input.toDate();
    } 

    // Format the time
    return date.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
            hour12: true
    }).toLowerCase();
}