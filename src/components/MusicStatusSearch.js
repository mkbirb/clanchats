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
            <div>
                <p> Music Status </p>
                <input 
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search Spotify..."
                />
                <button
                    onClick={searchTracks}
                    className="bg-green-600 px-3 py-2 rounded-lg"
                >
                    {loading ? "..." : "Search"}
                </button>
            </div>
            <div>
                {tracks.map((track) => (
                    <>
                        <div key={track.id} onClick={() => handleSelectTrack(track)}>
                            <img src={track.albumArt} />
                            <div>
                                <p>{track.name}</p>
                                <p>{track.artist}</p>
                            </div>

                        </div>
                    </>
                ))}
            </div>
        </>
    )
    
}

export default MusicStatusSearch;