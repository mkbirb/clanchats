// Stores the current token
let cachedToken = null;

export default async function getSpotifyToken() {
    try {
        // Use Token if Valid
        if (cachedToken && Date.now() < cachedToken.expires_at) {
            return cachedToken.access_token;
        }

        // Request new Spotify Token
        const response = await fetch("https://accounts.spotify.com/api/token", {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization:
                    "Basic " +
                    Buffer.from(
                    process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET
                    ).toString("base64"),
            },
            // Using the Client View version where User does not need to log in
            body: "grant_type=client_credentials",
        });

        // Read the data
        const data = await response.json();

        cachedToken = {
            access_token: data.access_token,
            expires_at: Date.now() + data.expires_in * 1000,
        };

       return cachedToken.access_token;
    }
    catch (error) {
        console.error("Spotify token error:", error);
    }
}