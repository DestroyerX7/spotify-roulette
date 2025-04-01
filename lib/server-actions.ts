"use server";

import axios from "axios";
import { setCookie } from "cookies-next";
import { cookies } from "next/headers";

type TokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
};

export async function getLoginData(code: string) {
  const redirectUri =
    process.env.NODE_ENV !== "development"
      ? process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI || ""
      : "http://localhost:3000/login/";

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

  const expireTime = Date.now() + response.data.expires_in * 1000;
  setCookies(response.data.access_token, refreshToken, expireTime);

  return response.data.access_token;
}

export async function auth(code: string | null) {
  const cookiesList = await cookies();
  const accessTokenCookie = cookiesList.get("accessToken");
  const refreshTokenCookie = cookiesList.get("refreshToken");
  const expireTimeCookie = cookiesList.get("expireTime");

  if (accessTokenCookie && refreshTokenCookie && expireTimeCookie) {
    const expireTimeNum = Number(expireTimeCookie.value);

    if (Date.now() < expireTimeNum) {
      return accessTokenCookie.value;
    }

    const response = await refreshToken(refreshTokenCookie.value);
    return response;
  } else {
    if (!code) {
      return null;
    }

    const response = await getLoginData(code);
    const expireTime = Date.now() + response.expiresIn * 1000;

    setCookies(response.accessToken, response.refreshToken, expireTime);
    return response.accessToken;
  }
}

function setCookies(
  accessToken: string,
  refreshToken: string,
  expireTime: number
) {
  setCookie("accessToken", accessToken, {
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "lax",
  });

  setCookie("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "lax",
  });

  setCookie("expireTime", expireTime, {
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "lax",
  });
}
