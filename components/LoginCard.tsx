"use client";

import { toast } from "sonner";
import LoginButton from "./LoginButton";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import Image from "next/image";
import { Button } from "./ui/button";

export default function LoginCard() {
  const messages = [
    "Shoutout to Landon, Lilly, Conrad, and Ashley.",
    "This is actually the first website I have deployed.",
    "I think the code for this website is pretty bad lol.",
    "Who is McBlack?",
    "It doesn't matter how bad the code is, it only matters that it works.",
    "This was easier than I thought it would be.",
    "Don't worry, I promise I won't steal your data.",
    "Based off Photo Roulette.",
    "Do you play chess? Just wondering...",
    "How much do u bench?",
    "No affiliation with Spotify btw.",
    "Am I allowed to use Spotify's name and logo?",
  ];

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

        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={() => {
            const messageIndex = Math.floor(Math.random() * messages.length);
            toast(
              <div className="flex gap-2 items-center">
                <h1 className="text-2xl">😁</h1>

                <div>
                  <h1>{messages[messageIndex]}</h1>

                  <p className="text-gray-500">McBlack - Master Programmer</p>
                </div>
              </div>
            );
          }}
        >
          Fun Message
        </Button>
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
