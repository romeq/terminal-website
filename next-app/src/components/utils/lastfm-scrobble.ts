export interface Scrobble {
    artist: string
    image: string
    album: string
    name: string
    date: string
    link: string
    currentlyPlaying: boolean
}

export async function loadScrobble(): Promise<Scrobble | null> {
    const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${process.env.LASTFM_USER}&limit=1&api_key=${process.env.LASTFM_APIKEY}&format=json`
    const req = await fetch(url)
    if (!req.ok) return null
    const body = await req.json()

    try {
        const recentTrack = body.recenttracks.track[0]

        let nowplaying = false
        try {
            nowplaying = recentTrack["@attr"].nowplaying
        } catch (e) {}

        let scrobble: Scrobble = {
            artist: recentTrack.artist["#text"],
            image: recentTrack.image[3]["#text"],
            album: recentTrack.album["#text"],
            name: recentTrack.name,
            link: recentTrack.url,
            currentlyPlaying: nowplaying,
            date: "",
        }

        if (!nowplaying) {
            const unixstamp = parseInt(recentTrack.date["uts"])
            const fulldate = new Date(unixstamp * 1000)
            scrobble.date = `${fulldate.getDate()}.${fulldate.getMonth()}.${fulldate.getFullYear()}`
        }

        return scrobble
    } catch (e) {
        return null
    }
}
