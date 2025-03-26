import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Button } from "./ui/button";
import { Player } from "@/server";

type Props = {
  playersList: Player[];
  selectLobbyPlayer: (player: Player) => void;
};

export default function LobbyPlayersCard({
  playersList,
  selectLobbyPlayer,
}: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Players</CardTitle>

        <CardDescription>
          Click on a player to see their top 5 songs
        </CardDescription>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        {playersList.map((player) => (
          <Button
            className="cursor-pointer"
            onClick={() => selectLobbyPlayer(player)}
            key={player.playerId}
          >
            {player.username}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
