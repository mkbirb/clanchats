import React from "react";
import { navigateTo } from "./Routes";
import { useRouter } from "next/router";

const ClanHome = ({clanData}) => {

    const router = useRouter();

    return (
        <>
            <p> {clanData.name} Home </p>
            <img src={clanData.logo} alt="Clan Logo"/>
            <p> Annoucements: </p>
            <p> Description: </p>
            <p> {clanData.description}</p>
            <button> Calender </button>
            <button> Gallery </button>
            <button onClick={() => {navigateTo(router, 'CLANEMOJIS', clanData.id)}}> Clan Emojis </button>
            <button> Members </button>
        </>
    )
}


export default ClanHome;