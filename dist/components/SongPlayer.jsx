"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SongPlayer;
const react_1 = require("react");
const react_spotify_web_playback_1 = __importDefault(require("react-spotify-web-playback"));
function SongPlayer({ accessToken, uris }) {
    const [play, setPlay] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        if (accessToken) {
            setPlay(true);
        }
    }, [accessToken]);
    return (<div>
      {accessToken ? (<react_spotify_web_playback_1.default token={accessToken} play={play} uris={uris} callback={(state) => {
                if (!state.isPlaying) {
                    setPlay(true);
                }
            }} showSaveIcon/>) : (<p>Please log in to Spotify</p>)}
    </div>);
}
