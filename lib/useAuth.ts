"use client";

import { useEffect, useState } from "react";
import { getLoginData, refreshToken } from "./server-actions";
import { setCookie, getCookie, hasCookie } from "cookies-next";

export default function useAuth(code: string | null) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Auto refresh the token later
  useEffect(() => {
    const login = async () => {
      if (hasCookie("accessToken")) {
        const accessTokenCookie = getCookie("accessToken") as string;
        const expireTimeCookie = Number(getCookie("expireTime"));

        if (Date.now() >= expireTimeCookie) {
          const refreshTokenCookie = getCookie("refreshToken") as string;

          const response = await refreshToken(refreshTokenCookie);

          const expireTime = Date.now() + response.expiresIn * 1000;

          setCookie("accessToken", response.accessToken, {
            maxAge: 60 * 60 * 24,
            secure: true,
            sameSite: "lax",
          });

          setCookie("refreshToken", response.refreshToken, {
            maxAge: 60 * 60 * 24,
            secure: true,
            sameSite: "lax",
          });

          setCookie("expireTime", expireTime, {
            maxAge: 60 * 60 * 24,
            secure: true,
            sameSite: "lax",
          });

          setAccessToken(response.accessToken);
          return;
        }

        setAccessToken(accessTokenCookie);
      } else {
        if (!code) {
          return;
        }

        const loginData = await getLoginData(code);

        const expireTime = Date.now() + loginData.expiresIn * 1000;

        setCookie("accessToken", loginData.accessToken, {
          maxAge: 60 * 60 * 24,
          secure: true,
          sameSite: "lax",
        });

        setCookie("refreshToken", loginData.refreshToken, {
          maxAge: 60 * 60 * 24,
          secure: true,
          sameSite: "lax",
        });

        setCookie("expireTime", expireTime, {
          maxAge: 60 * 60 * 24,
          secure: true,
          sameSite: "lax",
        });

        setAccessToken(loginData.accessToken);
      }
    };

    login();
  }, [code]);

  return accessToken;
}
