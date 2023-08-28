import { Scrobble, loadScrobble } from "./lastfm-scrobble"

function stringifyScrobble(sc: Scrobble) {
    return `${sc.currentlyPlaying ? "Currently playing" : "Recently listened"}: ${sc.name} from ${sc.artist} 
- Album '${sc.album}' ${sc.date ? `listened at ${sc.date}` : ""}`
}

const socials = ["GitHub: https://github.com/romeq", "Telegram: https://t.me/toke6"]

async function commandHistory() {
    let commandHistory = {
        "./whoami": "Hi! I'm Touko. Nice to meet you.",
    }

    try {
        commandHistory["./last-fm"] = stringifyScrobble(await loadScrobble())
    } catch {
        commandHistory["./last-fm"] = "Error! Failed to connect https://last.fm API :("
    }

    commandHistory["./socials"] = socials.join("\n")
    commandHistory["./blog"] = "You can find my blog at https://blog.tova.fi"

    return commandHistory
}

export { commandHistory }
