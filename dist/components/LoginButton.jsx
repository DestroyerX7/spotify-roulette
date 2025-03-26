"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginButton;
const button_1 = require("@/components/ui/button");
const link_1 = __importDefault(require("next/link"));
const sonner_1 = require("sonner");
const scopes = [
    "streaming",
    "user-read-email",
    "user-read-private",
    "user-library-read",
    "user-library-modify",
    "user-read-playback-state",
    "user-modify-playback-state",
    "user-top-read",
];
const scopeString = scopes.join("%20");
const redirectUri = process.env.NODE_ENV !== "development"
    ? process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
    : "http://localhost:3000/";
const loginUrl = `https://accounts.spotify.com/authorize?client_id=${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=${redirectUri}&scope=${scopeString}`;
function LoginButton() {
    return (<button_1.Button onClick={() => sonner_1.toast.loading("Loggin in...", { duration: 10000 })} className="cursor-pointer" asChild>
      <link_1.default href={loginUrl}>Login</link_1.default>
    </button_1.Button>);
}
