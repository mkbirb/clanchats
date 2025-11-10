const useCalculateEndTime = (startTime, durationMinutes) => {
    const [hours, minutes] = startTime.split(":").map(Number);

    // Gets Start Date in Date Format for the Calculation
    const start = new Date();

    start.setHours(hours, minutes, 0, 0);
    const end = new Date(start.getTime() + durationMinutes * 60000);

    // Return back into the format
    const endHours = String(end.getHours()).padStart(2, "0");
    const endMinutes = String(end.getMinutes()).padStart(2, "0");


    return `${endHours}:${endMinutes}`
}

export default useCalculateEndTime;