// Creates a vieweable Embed that displays the Youtube Link

import { useEffect, useState } from "react";

// Checks for the Youtube Link
const YOUTUBE_REGEX = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;


// Extracts the specific Youtube ID from the Link
const extractYoutubeId = (text) => {
    const match = text.match(YOUTUBE_REGEX);

    return match ? match[1] : null
}

async function getYouTubeVideoInfo(videoId) {
  const apiKey = "AIzaSyCr8id8uISvfqASBUbyzk1UMTIP_8Cqkkw";
  const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`;
  
  const res = await fetch(url);
  const data = await res.json();
  return data.items[0]?.snippet;
}


const YoutubeEmbed = ({textMessage}) => {
    const [videoData, setVideoData] = useState(null);

    useEffect(() => {
        const videoId = extractYoutubeId(textMessage);
        if(!videoId) return;

        const getYoutubeInfo = async () => {
            const snippet = await getYouTubeVideoInfo(videoId)

            setVideoData({...snippet, videoId})
        }

        getYoutubeInfo();
    }, [textMessage])

    if (typeof textMessage !== "string") return null; 

    if (!videoData) return null;

    return (
        <div>
            <p className="font-bold"> {videoData.title}</p>
            <p>by {videoData.channelTitle}</p>
            <iframe
                width="560"
                height="315"
                src={`https://www.youtube.com/embed/${videoData.videoId}`}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    )

}

export default YoutubeEmbed