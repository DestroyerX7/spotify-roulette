"use client";

import { useEffect, useState } from "react";
import { auth } from "./server-actions";
import { toast } from "sonner";

export default function useAuth(code: string | null = null) {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Auto refresh the token later
  useEffect(() => {
    const login = async () => {
      const response = await auth(code);
      setAccessToken(response);
    };

    if (code) {
      toast.promise(login(), {
        loading: "Logging in...",
        success: "Login successful!",
        error: "Something went wrong!",
      });
    } else {
      login();
    }
  }, [code]);

  return accessToken;
}
