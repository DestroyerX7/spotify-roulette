"use client";

import { Button } from "./ui/button";
import { toast } from "sonner";

export default function FunMessageButton() {
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
  );
}
