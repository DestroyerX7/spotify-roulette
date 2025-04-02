"use client";

import LoginButton from "./LoginButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import FunMessageButton from "./FunMessageButton";

export default function LoginCard() {
  return (
    <Card className="max-w-md">
      <CardHeader className="justify-center">
        <Image
          src="/SpotifyLogo.png"
          alt="Spotify Logo"
          width={200}
          height={200}
          priority
        />

        <CardTitle className="text-2xl font-bold text-center">
          Spotify Roulette
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <LoginButton />

        <FunMessageButton />
      </CardContent>

      <CardFooter>
        <p className="text-gray-500 text-center text-sm">
          Users must have Spotify premium and allow website access in order to
          play. (Required by Spotify)
        </p>
      </CardFooter>
    </Card>
  );
}
