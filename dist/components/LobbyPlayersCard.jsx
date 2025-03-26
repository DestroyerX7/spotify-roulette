"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LobbyPlayersCard;
const react_1 = __importDefault(require("react"));
const card_1 = require("./ui/card");
const button_1 = require("./ui/button");
function LobbyPlayersCard({ playersList, selectLobbyPlayer, }) {
    return (<card_1.Card>
      <card_1.CardHeader>
        <card_1.CardTitle>Players</card_1.CardTitle>

        <card_1.CardDescription>
          Click on a player to see their top 5 songs
        </card_1.CardDescription>
      </card_1.CardHeader>

      <card_1.CardContent className="grid grid-cols-2 gap-4">
        {playersList.map((player) => (<button_1.Button className="cursor-pointer" onClick={() => selectLobbyPlayer(player)} key={player.playerId}>
            {player.username}
          </button_1.Button>))}
      </card_1.CardContent>
    </card_1.Card>);
}
