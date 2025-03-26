"use strict";
"use client";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = useAuth;
const react_1 = require("react");
const server_components_1 = require("./server-components");
const cookies_next_1 = require("cookies-next");
function useAuth(code) {
    const [accessToken, setAccessToken] = (0, react_1.useState)(null);
    // Auto refresh the token later
    (0, react_1.useEffect)(() => {
        const login = async () => {
            if ((0, cookies_next_1.hasCookie)("accessToken")) {
                const accessTokenCookie = (0, cookies_next_1.getCookie)("accessToken");
                const expireTimeCookie = Number((0, cookies_next_1.getCookie)("expireTime"));
                if (Date.now() >= expireTimeCookie) {
                    const refreshTokenCookie = (0, cookies_next_1.getCookie)("refreshToken");
                    const response = await (0, server_components_1.refreshToken)(refreshTokenCookie);
                    const expireTime = Date.now() + response.expiresIn * 1000;
                    (0, cookies_next_1.setCookie)("accessToken", response.accessToken, {
                        maxAge: 60 * 60 * 24,
                        secure: true,
                        sameSite: "strict",
                    });
                    (0, cookies_next_1.setCookie)("refreshToken", response.refreshToken, {
                        maxAge: 60 * 60 * 24,
                        secure: true,
                        sameSite: "strict",
                    });
                    (0, cookies_next_1.setCookie)("expireTime", expireTime, {
                        maxAge: 60 * 60 * 24,
                        secure: true,
                        sameSite: "strict",
                    });
                    setAccessToken(response.accessToken);
                    return;
                }
                setAccessToken(accessTokenCookie);
            }
            else {
                if (!code) {
                    return;
                }
                const loginData = await (0, server_components_1.getLoginData)(code);
                const expireTime = Date.now() + loginData.expiresIn * 1000;
                (0, cookies_next_1.setCookie)("accessToken", loginData.accessToken, {
                    maxAge: 60 * 60 * 24,
                    secure: true,
                    sameSite: "strict",
                });
                (0, cookies_next_1.setCookie)("refreshToken", loginData.refreshToken, {
                    maxAge: 60 * 60 * 24,
                    secure: true,
                    sameSite: "strict",
                });
                (0, cookies_next_1.setCookie)("expireTime", expireTime, {
                    maxAge: 60 * 60 * 24,
                    secure: true,
                    sameSite: "strict",
                });
                setAccessToken(loginData.accessToken);
            }
        };
        login();
    }, [code]);
    return accessToken;
}
