// Compares the time to today’s date
// Then decides whether to display just the time, day of the week, or full date.
// Input is the Firestore Timestamp like "November 28, 2025 at 10:32:39 AM UTC+11"

import { getFormattedDate } from "./getFormattedDate";
import { getTimeFromFirestoreTimestamp } from "./getTimeFromFirestoreTimestamp";

export const getUpdatedTimeSince = (timestamp) => {

    if (!timestamp) return ""; 

    // Convert Firestore Timestamp to JS Date if needed
    const date = typeof timestamp.toDate === "function" ? timestamp.toDate() : new Date(timestamp);
    // Fallback if Invalid Date
    if (isNaN(date)) return "";

    const now = new Date();

    // Check if same day
    if (date.toDateString() === now.toDateString()) {
        return getTimeFromFirestoreTimestamp(timestamp);
    }

    // Check if within the same week to then dusplay the Day Only
    const diff = now - date; 
    if (diff < 7 * 24 * 60 * 60 * 1000) { 
        return date.toLocaleDateString(undefined, { weekday: 'short' });
    }

    // Otherwise show full date
    return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: '2-digit' });
}