// Converts the Time into a Human Readable Format, like 1:30 to 1 Hour 30 Minutes

export function getFormattedMinutes(totalMinutes) {
    // Sort the Invalid Times
    if (isNaN(totalMinutes) || totalMinutes <= 0) return "0 minutes";

    const hours = Math.floor(totalMinutes/60);
    const minutes = totalMinutes % 60;


    let hoursPart = "";
    let minutesPart = "";

    // Build the Hours Part
    if (hours > 0) {
        hoursPart = hours === 1 ? "1 hour" : `${hours} hours`;
    }

    if (minutes > 0) {
        minutesPart = minutes === 1 ? "1 minute" : `${minutes} minutes` 
    }

    // Combine the parts only if they exist
    const result = [hoursPart, minutesPart].filter(part => part !== "").join(" ");

    return result;
}