// Converts the Date into Human Readable Format like Tuesday 2/09/25
// Where the Input is "2025-06-20" form

export function getFormattedDate(dateStr) {
    if (!dateStr) return "";

    let date;

    // Handle the Firestore Stamp Format
    if (typeof dateStr.toDate === "function") {
        date = dateStr.toDate();
    } 
    else if (dateStr instanceof Date) {
        date = dateStr;
    }
    // Handle YYYY-MM-DD Format
    else if (typeof dateStr === "string" && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
        // Convert the Date String into an Date Object
        const [year, month, day] = dateStr.split("-").map(Number);
        // Months are 0 Indexed
        date = new Date(year, month - 1, day);
    } 
    else {
        // If input is unrecognized, return empty
        return "";
    }

    // Get the Weekday Name
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[date.getDay()];

    // Do the Format
    const formattedDay = String(date.getDate()).padStart(2, "0");
    const formattedMonth = String(date.getMonth() + 1).padStart(2, "0");
    const formattedYear = date.getFullYear();

    return `${weekday} ${formattedDay}/${formattedMonth}/${formattedYear}`
}