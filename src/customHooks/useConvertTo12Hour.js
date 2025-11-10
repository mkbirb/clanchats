const useConvertTo12Hour = (time) => {

    if (!time || typeof time !== "string" || !time.includes(":")) {
        return "Invalid time";
    }

    let [hours, minutes] = time.split(":").map(Number);

    // Determine whether the time is AM or PM
    const ampm = (hours >= 12) ? "PM" : "AM";

    // Convert the Time into 12 Hour Format
    hours = hours % 12 || 12;

    // Format the Minutes
    const formattedMinutes = String(minutes).padStart(2, "0");
    return `${hours}:${formattedMinutes} ${ampm}`;
}

export default useConvertTo12Hour;