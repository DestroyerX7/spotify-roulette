import React from "react";
import { Button } from "./ui/button";

type Props = {
  playerId: string;
  username: string;
  canSelect: boolean;
  isSelected: boolean;
  showCorrectAnswer: boolean;
  correctPlayerId: string;
  selectPlayer: (playerId: string) => void;
};

export default function PlayerSelectionButton({
  playerId,
  username,
  canSelect,
  isSelected,
  showCorrectAnswer,
  correctPlayerId,
  selectPlayer,
}: Props) {
  const trySelect = () => {
    if (!canSelect) {
      return;
    }

    selectPlayer(playerId);
  };

  const getColor = () => {
    if (showCorrectAnswer) {
      if (correctPlayerId === playerId) {
        return "bg-green-500";
      } else {
        return "bg-red-500";
      }
    } else if (isSelected) {
      return "border-2 border-black";
    } else {
      return "";
    }
  };

  const ponierBehaviour = canSelect ? "cursor-pointer" : "pointer-events-none";
  const color = getColor();

  return (
    <Button
      className={`${ponierBehaviour} ${color}`}
      onClick={() => trySelect()}
      variant="secondary"
    >
      {username}
    </Button>
  );
}
