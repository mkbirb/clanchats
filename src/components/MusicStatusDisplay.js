import useMusicStatus from "../customHooks/useMusicStatus";

const MusicStatusDisplay = ({userID}) => {

    const musicStatus = useMusicStatus(userID);

    if (!musicStatus) {
        return (
            <>
                <p> No Music Status Set</p>
            </>
        )
    }

    return (
        <div className="music-status-card border p-4 rounded-lg flex flex-col items-center">
        <img
            src={musicStatus.albumArt}
            alt={musicStatus.name}
            className="w-40 h-40 mb-2"
        />
        <h3 className="font-bold">{musicStatus.name}</h3>
        <p className="text-gray-600">{musicStatus.artist}</p>

        <a
            href={musicStatus.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-green-600 underline mt-1"
        >
            Open in Spotify
        </a>

        <iframe
            src={`https://open.spotify.com/embed/track/${musicStatus.id}`}
            width="300"
            height="80"
            allowtransparency="true"
            allow="encrypted-media"
            className="mt-2"
        ></iframe>
        </div>
    );
}

export default MusicStatusDisplay