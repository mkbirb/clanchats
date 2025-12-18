import React, { useState, useEffect } from "react";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";
import Slideshow from "./Slideshow";
import { ClanSlidesDefault } from "./definitions/ClanSlideDefault";
import { getClanSlides } from "./firebaseConfig";
import ClanAnnoucements from "./ClanAnnoucements";
import LeaveClan from "./LeaveClan";
import PollList from "./PollList";
import ClanMembersOnline from "./ClanMembersOnline";
import Image from "next/image";
import calenderIcon from '../images/calendarIcon.png';
import timetableIcon from '../images/timetableIcon.png';
import memoryBoardIcon from '../images/memoryBoardIcon.png';
import clanEmojisIcon from '../images/clanEmojisIcon.png';
import galleryIcon from '../images/galleryIcon.png';
import membersIcon from '../images/membersIcon.png';


const ClanHome = ({clanData, currentUser}) => {
    const [slides, setSlides] = useState(ClanSlidesDefault);
    const router = useRouter();

    // Fetch the Slides
    useEffect(() => {
        const fetchClanSlides = async() => {
            try {
                const fetchedSlides = await getClanSlides(clanData.id);

                setSlides(Array.isArray(fetchedSlides) && fetchedSlides.length > 0 ? fetchedSlides : ClanSlidesDefault);
            }
            catch(error) {
                console.log("Cannot fetch Clan Slides", error);
            }
        }   

        fetchClanSlides();
    }, [clanData.id] );


    const createClanFeaturesButton = (router, routeName, clanId, imageSrc, label) => {
        return (
            <>
                <div className="flex flex-row !bg-[#cb9638] !border !border-none !rounded-2xl !mb-2">
                    <button
                        onClick={() => navigateTo(router, routeName, clanId)}
                        className="flex flex-row items-center justify-center text-center gap-3 !font-bold !text-3xl !p-3 !text-white !cursor-pointer"
                    >
                        <Image src={imageSrc} alt={label} className="h-5 w-15" />
                        <span className="w-full text-center">{label}</span>
                    </button>
                </div>
            </>
        );
    };

    return (
        <>
            <div className="flex flex-2 gap-3">
                <div>
                    <div className="bg-[#7fc1ff] rounded-2xl !p-3 flex flex-col items-center">
                        <img 
                            src={clanData.logo} 
                            alt="Clan Logo"
                            className="h-[12vh] w-[12vw] rounded-full aspect-square object-cover"/>
                        <p className="text-center font-bold text-white text-2xl"> {clanData.name} </p>
                    </div>
                    <div className="bg-[#a4c2f7] rounded-2xl !p-3 !mt-3">
                        <p className="text-center text-white text-base"> {clanData.description}</p>
                    </div>
                    <div className="bg-[#418cfe] rounded-2xl !p-3 !mt-3 flex flex-col items-center">
                        <ClanMembersOnline clanData={clanData}/>
                    </div>
                </div>
                <div className="bg-[#cb9638] h-[40vh] w-full flex flex-col items-center ">
                    <Slideshow images={slides}/>
                </div>
            </div>
            <ClanAnnoucements clanData={clanData} currentUser={currentUser} />
            <PollList clanData={clanData} />
            <div className="flex flex-2 justify-center items-center gap-3 !mt-5">
                <div className="flex flex-col w-[30%]">
                    {createClanFeaturesButton(router, "CLANCALENDER", clanData.id, calenderIcon, "Calendar")}
                    {createClanFeaturesButton(router, "MEMORYBOARD", clanData.id, memoryBoardIcon, "Memory Board")}
                    {createClanFeaturesButton(router, "CLANEMOJIS", clanData.id, clanEmojisIcon, "Clan Emojis")}
                </div>
                <div className="flex flex-col  w-[30%]">
                    {createClanFeaturesButton(router, "CLANTIMETABLES", clanData.id, timetableIcon, "Timetables")}
                    {createClanFeaturesButton(router, "", clanData.id, galleryIcon, "Gallery")}
                    {createClanFeaturesButton(router, "CLANMEMBERLIST", clanData.id, membersIcon, "Members")}
                </div>
            </div>
            <LeaveClan clanData={clanData}/>
        </>
    )
}


export default ClanHome;