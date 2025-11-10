// For the Sharing of the Timetable, such as through a formatted text

import { useEffect, useState } from "react"
import Modal from "react-modal"
import useCalculateEndTime from "../customHooks/useCalculateEndTime";
import useConvertTo12Hour from "../customHooks/useConvertTo12Hour";
import { getFormattedMinutes } from "../utils/getFormattedMinutes";
import { getFormattedDate } from "../utils/getFormattedDate";

const TimetableShare = ({timetable, timetableTasks, isOpen, onClose}) => {
    const [shareModeOption, setShareModeOption] = useState("chooseMode");
    const [copied, setCopied] = useState(false);


    // Stores the Text of the Timetable that the user can copy
    const [text, setText] = useState("");

    // Converts the Number into Emojis
    const toEmojiNumber = (num) => {
        const digitMap = {
            "0": "0️⃣",
            "1": "1️⃣",
            "2": "2️⃣",
            "3": "3️⃣",
            "4": "4️⃣",
            "5": "5️⃣",
            "6": "6️⃣",
            "7": "7️⃣",
            "8": "8️⃣",
            "9": "9️⃣",
        };
        // Converts Two+ Digit Numbers into Emoji
        return String(num)
        .split("")
        .map((digit) => digitMap[digit] || digit)
        .join("");
    }

    useEffect(() => {
        if (timetableTasks?.length > 0) {
            const timeTableTitle = timetable.title || "Untitled Timetable";
            const timeTableDate = timetable.date || "Unknown Date";
            const formattedDate = getFormattedDate(timeTableDate);
            const timeTablePrice = timetable.price || "Unknown Price";
            const timeTableMaterials = timetable.materials || "Unknown Materials";
            const timeTableNotes = timetable.additionalNotes || "No Additional Notes";

            // Add the Task Text
            const timetableText = timetableTasks.map((task, index) => {
                const emojiNumber = toEmojiNumber(index + 1);
                const title = task.title || "Untitled Task";
                const desc = task.description || "No description";
                const duration = task.duration || "Unknown Duration";
                const formattedDuration = getFormattedMinutes(duration);
                const timeSlot = task.timeSlot || "Unknown Timeslot";
                const startTime = useConvertTo12Hour(timeSlot);
                const endTime = useConvertTo12Hour(useCalculateEndTime(timeSlot, duration));

                return ` ${emojiNumber} **${title}: ${startTime} to ${endTime}**\n *Duration: ${formattedDuration}*\n ▶️ ${desc}\n `;
            }).join("\n");

            // Add the Timetable Text as well
            const fullText = [
                `**${timeTableTitle}**\n`,
                `DATE: ${formattedDate} \n`,
                `Price: \n$${timeTablePrice} \n`,
                `Materials to Bring: \n ${timeTableMaterials} \n`,
                `Additional Notes: \n ${timeTableNotes} \n`,
                `**🗓️ TIMETABLE:** \n`,
                timetableText,
            ].join("\n");

            setText(fullText);
        }
        else {
            setText("No Tasks Found");
        }
    }, [timetableTasks])

    // Copies the Text onto the Users Clipboard
    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        }
        catch(error) {
            console.error("Failed to copy:", error);
        }
    }


    return (
        <>
            <Modal isOpen={isOpen} onRequestClose={onClose}>
                {shareModeOption == "chooseMode" &&
                (<>
                    <p> Share Timetable through...</p>
                    <button onClick={() => setShareModeOption("text")}> Text </button>
                    <button onClick={() => setShareModeOption("pdf")}> PDF </button>
                </>)}
                {shareModeOption == "text" && (
                    <>
                        <div>
                            <textarea
                                value={text}
                                readOnly
                                rows={8}
                                className="w-full p-3 border rounded-md bg-gray-100 font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                            />
                        </div>
                        <button
                            onClick={copyToClipboard}
                            className={`px-4 py-2 rounded-md text-white font-semibold transition-colors duration-200 ${
                            copied ? "bg-green-600" : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {copied ? "Copied ✅" : "Copy Tasks"}
                        </button>
                    </>
                )}

            </Modal>
        </>
    )
}

export default TimetableShare