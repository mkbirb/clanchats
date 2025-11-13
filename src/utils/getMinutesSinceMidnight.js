// Converts a time like 15:30 to 930, which is the number of Minutes since midnight
export function getMinutesSinceMidnight(time) {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
}