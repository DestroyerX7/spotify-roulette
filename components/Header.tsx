import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";
import Image from "next/image";

export default function Header() {
  return (
    <div className="relative">
      <header className="fixed top-0 left-0 right-0 border-b-2 flex items-center p-4 justify-between bg-white">
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
          <Button asChild>
            <Link href="/">Login</Link>
          </Button>

          <Button variant="secondary" asChild>
            <Link href="/about">About</Link>
          </Button>
        </div>
      </header>
    </div>
  );
}
