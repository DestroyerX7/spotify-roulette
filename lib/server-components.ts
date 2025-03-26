"use server";

import axios from "axios";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export async function getLoginData(code: string) {
  const redirectUri =
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || ""
      : "http://localhost:3000/";

  const response = await axios.post<TokenResponse>(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: "authorization_code",
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expiresIn: response.data.expires_in,
  };
}

export async function refreshToken(refreshToken: string) {
  const response = await axios.post<TokenResponse>(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
    {
      headers: {
        Authorization:
          "Basic " +
          Buffer.from(
            `${process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID}:${process.env.SPOTIFY_CLIENT_SECRET}`
          ).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return {
    accessToken: response.data.access_token,
    refreshToken: refreshToken,
    expiresIn: response.data.expires_in,
  };
}
