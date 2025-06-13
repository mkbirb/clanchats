import React, { useEffect, useState} from "react";
import Modal from 'react-modal';
import { useRouter } from "next/router";
import { addClanMember, getPaginatedMembers, getSpecificUsersIDs, getUserByID, removeClanMember } from "../../../components/firebaseConfig";
import { navigateTo } from "../../../components/Routes";
import UserSelector from "../../../components/UserSelector";

const clanMembers = () => {
    // Determines how many Members appear in the Member List
    const PAGE_SIZE = 10;
    const [members, setMembers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [isLastPage, setIsLastPage] = useState(false);

    // To prevent possibility of entering No Members Found when pressing Next fast
    const [loading, setLoading] = useState(false);

    const router = useRouter();
    const {clan} = router.query;

    const [displayAddUserModal, setDisplayAddUserModal] = useState(false);

    // Whenever the current page set changes than load that pages members
    useEffect(() => {
        if (clan) {
            loadingMembersPage(currentPage);
        }
    }, [clan, currentPage]);


    const loadingMembersPage = async (currentPage) => {
        setLoading(true);
        try {
            const {docs, isLastPage} = await getPaginatedMembers(clan, PAGE_SIZE, currentPage);
            
            // Fill the Page with the Members
            setMembers(docs);
            setIsLastPage(isLastPage);
        }
        catch (error) {
            console.log("Cannot get Paginated Members ", error);
        }
        setLoading(false);
    }

    const handleRemoveMember = async (userID) => {
        try {
            await removeClanMember(clan, userID);
            // Refresh the List
            if (members.length === 1 && currentPage > 1) {
                setCurrentPage((p) => p - 1);
            } 
            else {
                loadingMembersPage(currentPage); 
            }
        }
        catch(error) {
            console.log("Could not remove Member from clan ", error);
        }
    }
    
    const handleAddMember = async (username) => {
        const userIDs = await getSpecificUsersIDs(username);
        const userID = Array.isArray(userIDs) ? userIDs[0] : userIDs;

        if (!userID) {
            console.warn("No UID found for username:", username);
            return;
        }

        await addClanMember(clan, userID);
        const userData = await getUserByID(userID);      
        setMembers(prev => [...prev, userData]);
        loadingMembersPage(currentPage);
    };

    return (
        <>
            <Modal 
                isOpen={displayAddUserModal}
                onRequestClose={() => {setDisplayAddUserModal(false)}}
            >
                <UserSelector onAdd={handleAddMember} selectedUsers={members.map(m => m.id)} />
            </Modal>
            <button onClick={() => navigateTo(router, 'CHAT', clan)}> To Dashboard</button>
            <p> Clan Members </p>
            <button onClick={() => {setDisplayAddUserModal(true)}}> Add Member </button>
            <div>
                <ul>
                    {members.length === 0 ? (
                        <li>No members found</li>
                    ) :
                        members.map((member) => (
                            <div key={member.id}>
                                <li>{member.name}</li>
                                <button onClick={() => handleRemoveMember(member.id)}>Remove</button>
                            </div>
                    ))}
                </ul>
                <button 
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                >
                    Previous 
                </button>
                <span> {`Page ${currentPage}`} </span>
                <button
                    onClick={() => setCurrentPage((prev) => prev + 1)}
                    disabled={isLastPage || loading}
                >
                    Next
                </button>

            </div>
        </>
    )
}

export default clanMembers;