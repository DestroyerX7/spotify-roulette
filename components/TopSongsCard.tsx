import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";
import { Player } from "@/server";

type Props = {
  selectedLobbyPlayer: Player;
};

export default function TopSongsCard({ selectedLobbyPlayer }: Props) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{selectedLobbyPlayer.username}&apos;s Top Songs</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        {selectedLobbyPlayer.topTracks.map((track) => (
          <div
            className="flex p-2 rounded-md items-center gap-4 bg-gray-200"
            key={track.id}
          >
            <Image
              src={track.album.images[0].url}
              alt="Album Cover"
              width={32}
              height={32}
              priority
            />

            <h1>{track.name}</h1>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
