// To the Dashboard Button

import { useRouter } from "next/router";
import { useCurrentUser } from "../context/CurrentUserContext";
import { navigateTo } from "./Routes";
import DashboardIcon from '../images/dashboardIcon.png'
import Image from "next/image";

const DashboardButton = () => {
    const {changeRoomID} = useCurrentUser(); 

    const router = useRouter();
    
    return (
        <>
            <button 
                onClick={() => {navigateTo(router, "DASHBOARD"), changeRoomID(null) }} 
                className="flex flex-col !bg-black !text-white cursor-pointer items-center !font-bold !border-none !rounded-2xl !p-2"> 
                <Image src={DashboardIcon} alt="Dashboard Icon" width={35} height={35} /> To Dashboard </button>
        </>
    )
}

export default DashboardButton;