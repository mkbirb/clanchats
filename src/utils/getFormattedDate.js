// Converts the Date into Human Readable Format like Tuesday 2/09/25

export function getFormattedDate(dateStr) {
    if (!dateStr) return "";

    // Convert the Date String into an Date Object
    const [year, month, day] = dateStr.split("-").map(Number);

    // Months are 0 Indexed
    const date = new Date(year, month - 1, day);

    // Get the Weekday Name
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[date.getDay()];

    // Do the Format
    const formattedDay = String(day).padStart(2, "0");
    const formattedMonth = String(month).padStart(2, "0");
    const formattedYear = String(year).slice(2);

    return `${weekday} ${formattedDay}/${formattedMonth}/${formattedYear}`
}