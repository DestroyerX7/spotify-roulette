"use client";

import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import useAuth from "@/lib/useAuth";
import { FaUserCircle } from "react-icons/fa";

export default function Header() {
  const accessToken = useAuth();

  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 border-b-2 flex items-center p-4 justify-between bg-white z-50">
        <Link href="/" className="flex gap-4 items-center">
          <Image
            src="/SpotifyLogo.png"
            alt="Spotify Logo"
            width={32}
            height={32}
            priority
          />

          <h1 className="font-bold">Spotify Roulette</h1>
        </Link>

        <div className="flex gap-4 items-center">
          {accessToken ? (
            <Button asChild>
              <Link href="/game">Play</Link>
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Login</Link>
            </Button>
          )}

          <Button variant="secondary" asChild>
            <Link href="/about">About</Link>
          </Button>

          {accessToken && (
            <Link href="/me">
              <FaUserCircle className="text-4xl" />
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
