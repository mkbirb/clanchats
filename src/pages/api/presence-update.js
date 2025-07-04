
import { doc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../firebase";

export default async function handler(req, res) {
    // Post Requests are only accepted
    if (req.method !== "POST") {
        return res.status(405).end("Method Not Allowed");
    }

    const { path } = req.query;

    if (!path) {
        return res.status(400).json({ error: "Missing path" });
    }

    // Tries to parse String Body of POSt into Javascript Object
    let data;
    try {
        data = JSON.parse(req.body);
    } catch (e) {
        return res.status(400).json({ error: "Invalid JSON body" });
    }

    const { presence, lastActive } = data;

    if (!["online", "idle", "offline"].includes(presence)) {
        return res.status(400).json({ error: "Invalid presence" });
    }

    try {
        // Updates the FIrebase Document
        const docRef = doc(db, path);
        await updateDoc(docRef, {
            presence,
            lastActive: Timestamp.fromMillis(lastActive),
        });
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error("Firestore update failed:", err);
        return res.status(500).json({ error: "Firestore update failed" });
    }
}
