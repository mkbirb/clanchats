import getSpotifyToken from "./token";

const handler = async (req, res) => {
    // Requests Query from the Handler
    const q = req.query.q;
    if (!q) {
        return res.status(400).json({ error: "Missing query" });
    } 

    const token = await getSpotifyToken();

    // Make Request to Spotify's search Endpoint
    const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=10`,
        {
            headers: { Authorization: `Bearer ${token}` },
        }
    );

    const data = await response.json();

    // Check the Data recieved from Spotify
    if (!data.tracks || !data.tracks.items) {
        return res.status(500).json({ error: "Invalid response from Spotify" });
    }

    // Only define the data that we do need
    const tracks = data.tracks.items.map((t) => ({
        id: t.id,
        name: t.name,
        artist: t.artists.map((a) => a.name).join(", "),
        album: t.album.name,
        albumArt: t.album.images?.[0]?.url,
        url: t.external_urls.spotify,
    }));

    // Sends Spotify JSON File
    res.status(200).json({ tracks });
}

export default handler;