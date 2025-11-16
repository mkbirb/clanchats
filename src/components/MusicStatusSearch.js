import { useState } from "react";
import { spotifySearchTracks } from "./firebaseConfig";

const MusicStatusSearch = ({userID}) => {
    const [query, setQuery] = useState("");
    const [tracks, setTracks] = useState([]);
    const [loading, setLoading] = useState(false);

    // Search the Spotify Tracks
    const searchTracks = async () => {
        if (!query) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/spotify/search?q=${encodeURIComponent(query)}`);
            const data = await res.json();
            setTracks(data.tracks || {});
        }
        catch (error) {
            console.error("Spotify search error:", error);
        }
        setLoading(false);
    }

    const handleSelectTrack = (track) => {
        spotifySearchTracks(track, userID);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center gap-3">
                <p className="font-bold text-black text-3xl"> Change Music Status </p>
                <div className="flex gap-3">
                    <input 
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search Song from Spotify..."
                        className="!flex-1 !px-4 !py-2 w-md !border !border-gray-300 !focus:outline-none !focus:ring-2 !focus:ring-green-500 !focus:border-green-500"
                    />
                    <button
                        onClick={searchTracks}
                        className="!bg-green-600 !px-3 !py-2 !rounded-lg cursor-pointer !font-bold !text-white"
                    >
                        {loading ? "..." : "Search"}
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-5 gap-5 !mt-5">
                {tracks.map((track) => (
                    <>
                        <div 
                            key={track.id} 
                            onClick={() => handleSelectTrack(track)}
                            className="flex flex-col items-center justify-center text-center bg-black !border-5 !md:border-4 !lg:border-8 !border-orange-400 cursor-pointer">
                            <img src={track.albumArt} className="w-2/2"/>
                            <p className="text-white font-bold">{track.name}</p>
                            <p className="text-white">{track.artist}</p>

                        </div>
                    </>
                ))}
            </div>
        </>
    )
    
}

export default MusicStatusSearch;