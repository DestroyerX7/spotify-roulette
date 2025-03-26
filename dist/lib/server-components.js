"use strict";
"use server";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginData = getLoginData;
exports.refreshToken = refreshToken;
const axios_1 = __importDefault(require("axios"));
async function getLoginData(code) {
    const redirectUri = process.env.NODE_ENV !== "development"
        ? process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || ""
        : "http://localhost:3000/";
    const response = await axios_1.default.post("https://accounts.spotify.com/api/token", new URLSearchParams({
        code: code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
    }), {
        headers: {
            Authorization: "Basic " +
                Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
    };
}
async function refreshToken(refreshToken) {
    const response = await axios_1.default.post("https://accounts.spotify.com/api/token", new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: refreshToken,
    }), {
        headers: {
            Authorization: "Basic " +
                Buffer.from(`${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`).toString("base64"),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
    return {
        accessToken: response.data.access_token,
        refreshToken: refreshToken,
        expiresIn: response.data.expires_in,
    };
}
