// Determines the Status to display, based on both the User Status and User Presence

export function getDisplayStatus({status, presence}) {
    if (presence === "offline") {
        return "offline";
    }

    if (status === "idle") {
        return "idle"
    }

    if (status === "doNotDisturb") {
        return "doNotDisturb"
    }

    if (status === "away") {
        return "away"
    }

    if (status === "slow") {
        return "slow"
    }

    // Otherwise display status
    return presence;
}