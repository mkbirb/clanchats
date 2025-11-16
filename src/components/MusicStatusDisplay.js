import useMusicStatus from "../customHooks/useMusicStatus";
import { FiExternalLink } from "react-icons/fi";

const MusicStatusDisplay = ({userID}) => {

    const musicStatus = useMusicStatus(userID);

    if (!musicStatus) {
        return (
            <>
                <p className="font-bold"> No Music Status Set</p>
            </>
        )
    }

    return (
        <div className="!border !border-5 !border-amber-500 bg-black !p-4 !rounded-lg flex flex-col items-center">
            <img
                src={musicStatus.albumArt}
                alt={musicStatus.name}
                className="w-40 h-40 mb-2"
            />
            <h3 className="!font-bold text-white !mt-3">{musicStatus.name}</h3>
            <p className="text-white">{musicStatus.artist}</p>

            <iframe
                src={`https://open.spotify.com/embed/track/${musicStatus.id}`}
                width="300"
                height="80"
                allowtransparency="true"
                allow="encrypted-media"
                className="!mt-3"
            ></iframe>
            <button
                href={musicStatus.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center !rounded-lg justify-center !mt-5 !p-1 text-center !w-[60%] gap-2 !bg-green-400 !font-bold  !text-white cursor-pointer"
            >
                Open in Spotify
                <FiExternalLink className="!text-white text-[clamp(1rem, 2vw, 2rem)]" />
            </button>
        </div>
    );
}

export default MusicStatusDisplay