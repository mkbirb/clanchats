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

const ClanHome = ({clanData}) => {
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

    return (
        <>
            <p> {clanData.name} Home </p>
            <img src={clanData.logo} alt="Clan Logo"/>
            <Slideshow images={slides}/>
            <ClanAnnoucements clanData={clanData} />
            <PollList clanData={clanData} />
            <p> Description: </p>
            <p> {clanData.description}</p>
            <ClanMembersOnline clanData={clanData}/>
            <button onClick={() => {navigateTo(router, 'CLANCALENDER', clanData.id)}}> Calender </button>
            <button> Gallery </button>
            <button onClick={() => {navigateTo(router, 'CLANTIMETABLES', clanData.id)}}> Timetables </button>
            <button onClick={() => {navigateTo(router, 'CLANEMOJIS', clanData.id)}}> Clan Emojis </button>
            <button onClick={() => {navigateTo(router, 'CLANMEMBERLIST', clanData.id)}}> Members </button>
            <button onClick={() => {navigateTo(router, 'MEMORYBOARD', clanData.id)}}> Memory Board </button>
            <LeaveClan clanData={clanData}/>
        </>
    )
}


export default ClanHome;