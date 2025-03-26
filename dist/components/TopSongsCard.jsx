"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TopSongsCard;
const react_1 = __importDefault(require("react"));
const card_1 = require("./ui/card");
const image_1 = __importDefault(require("next/image"));
function TopSongsCard({ selectedLobbyPlayer }) {
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>{selectedLobbyPlayer.username}&apos;s Top Songs</card_1.CardTitle>
      </card_1.CardHeader>

      <card_1.CardContent className="flex flex-col gap-2">
        {selectedLobbyPlayer.topTracks.map((track) => (<div className="flex p-2 rounded-md items-center gap-4 bg-gray-200" key={track.id}>
            <image_1.default src={track.album.images[0].url} alt="Album Cover" width={32} height={32} unoptimized/>

            <h1>{track.name}</h1>
          </div>))}
      </card_1.CardContent>
    </card_1.Card>);
}
