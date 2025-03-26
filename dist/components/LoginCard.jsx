"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LoginCard;
const sonner_1 = require("sonner");
const LoginButton_1 = __importDefault(require("./LoginButton"));
const card_1 = require("./ui/card");
const image_1 = __importDefault(require("next/image"));
const button_1 = require("./ui/button");
function LoginCard() {
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
    ];
    return (<card_1.Card className="max-w-md">
      <card_1.CardHeader className="justify-center">
        <image_1.default src="/favicon.ico" alt="Spotify Logo" width={200} height={200} priority/>

        <card_1.CardTitle className="text-2xl font-bold text-center">
          Spotify Roulette
        </card_1.CardTitle>
      </card_1.CardHeader>

      <card_1.CardContent className="flex flex-col gap-4">
        <LoginButton_1.default />

        <button_1.Button className="cursor-pointer" variant="secondary" onClick={() => {
            const messageIndex = Math.floor(Math.random() * messages.length);
            (0, sonner_1.toast)(<div className="flex gap-2 items-center">
                <h1 className="text-2xl">😁</h1>

                <div>
                  <h1>{messages[messageIndex]}</h1>

                  <p className="text-gray-500">McBlack - Master Programmer</p>
                </div>
              </div>);
        }}>
          Fun Message
        </button_1.Button>
      </card_1.CardContent>

      <card_1.CardFooter>
        <p className="text-gray-500 text-center text-sm">
          Users must have Spotify premium and allow website access in order to
          play. (Required by Spotify)
        </p>
      </card_1.CardFooter>
    </card_1.Card>);
}
