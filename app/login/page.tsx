"use client";

import Header from "@/components/Header";
import LoginCard from "@/components/LoginCard";
import useAuth from "@/lib/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Toaster } from "sonner";

export default function Login() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const accessToken = useAuth(code);
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push("/game");
    }
  }, [accessToken, router]);

  return (
    <>
      <Header />

      <div className="min-h-screen flex items-center p-4">
        <div className="mx-auto">
          <LoginCard />
        </div>

        <Toaster position="top-center" />
      </div>
    </>
  );
}
