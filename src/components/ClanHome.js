import React from "react";

const ClanHome = ({clanData}) => {
    return (
        <>
            <p> {clanData.name} Home </p>
            <img src={clanData.logo} alt="Clan Logo"/>
            <p> Annoucements: </p>
            <p> Description: </p>
            <p> {clanData.description}</p>
            <button> Calender </button>
            <button> Gallery </button>
            <button> Clan Emojis </button>
            <button> Members </button>
        </>
    )
}


export default ClanHome;