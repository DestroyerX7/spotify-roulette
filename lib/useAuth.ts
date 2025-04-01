"use client";

import { useEffect, useState } from "react";
import { auth } from "./server-actions";

export default function useAuth(code: string | null = null) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Auto refresh the token later
  useEffect(() => {
    const login = async () => {
      const response = await auth(code);
      setAccessToken(response);
    };

    login();
  }, [code]);

  return accessToken;
}
