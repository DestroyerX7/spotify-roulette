"use server";

import axios from "axios";
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

  const expireTime = Date.now() + response.data.expires_in * 1000;

  return {
    accessToken: response.data.access_token,
    refreshToken: response.data.refresh_token,
    expireTime: expireTime,
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

  return {
    accessToken: response.data.access_token,
    refreshToken: refreshToken,
    expireTime: expireTime,
  };
}

export async function auth(code: string | null = null) {
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
    await setCookies(
      response.accessToken,
      response.refreshToken,
      response.expireTime
    );

    return response.accessToken;
  } else {
    if (!code) {
      return null;
    }

    const response = await getLoginData(code);
    await setCookies(
      response.accessToken,
      response.refreshToken,
      response.expireTime
    );

    return response.accessToken;
  }
}

async function setCookies(
  accessToken: string,
  refreshToken: string,
  expireTime: number
) {
  const cookieList = await cookies();

  cookieList.set("accessToken", accessToken, {
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  cookieList.set("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "lax",
    path: "/",
  });

  cookieList.set("expireTime", expireTime.toString(), {
    maxAge: 60 * 60 * 24,
    secure: true,
    sameSite: "lax",
    path: "/",
  });
}
