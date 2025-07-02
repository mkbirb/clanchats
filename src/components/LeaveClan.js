import { useState } from "react";
import { useCurrentUser } from "../context/CurrentUserContext"
import { removeClanMember } from "./firebaseConfig"
import { navigateTo } from "./Routes";
import Modal from 'react-modal';
import { useRouter } from "next/router";

const LeaveClan = ({clanData}) => {
    const [confirmationModal, setConfirmationModal] = useState(false);

    const {userID} = useCurrentUser();

    // Get the Clan ID from the URL Parameter
    const router = useRouter();

    const handleLeaveClan = (option) => {

        if (option) {
            removeClanMember(clanData.id, userID )

            navigateTo(router, "DASHBOARD");
        }

        setConfirmationModal(false);
    }

    return (
        <>
            <button onClick={() => setConfirmationModal(true)}> Leave Clan </button>

            <Modal isOpen={confirmationModal} onRequestClose = {() => setConfirmationModal(false)}>
                <p> Are you sure you want to leave {clanData.name} ? </p>
                <button onClick={() => handleLeaveClan(true)}> Yes </button>
                <button onClick={() => handleLeaveClan(false)}> No </button>
            </Modal>
        </>
    )
}

export default LeaveClan;