"use client";

import CreateLobbyForm from "@/components/CreateLobbyForm";
import JoinLobbyForm from "@/components/JoinLobbyForm";
import LobbyPlayersCard from "@/components/LobbyPlayersCard";
import LoginCard from "@/components/LoginCard";
import PlayerSelectionButton from "@/components/PlayerSelectionButton";
import SongPlayer from "@/components/SongPlayer";
import TopSongsCard from "@/components/TopSongsCard";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsList, Tabs, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import useAuth from "@/lib/useAuth";
import { Player, RoomData } from "@/server";
import { socket } from "@/socket";
import axios from "axios";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";

type TracksResponse = {
  items: TrackObject[];
  total: number;
};

type TrackObject = {
  track: Track;
};

export type Track = {
  album: Album;
  name: string;
  uri: string;
  artists: Artist[];
  id: string;
};

export type Album = {
  images: AlbumImage[];
  name: string;
};

export type AlbumImage = {
  url: string;
};

export type Artist = {
  name: string;
};

export default function Home() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");

  const [tracks, setTracks] = useState<Track[]>([]);
  const tracksRef = useRef<Track[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [selectedLobbyPlayer, setSelectedLobbyPlayer] = useState<Player | null>(
    null
  );

  const [roomData, setRoomData] = useState<RoomData | null>(null);
  const roomDataRef = useRef<RoomData | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const [showScores, setShowScores] = useState(false);

  const accessToken = useAuth(code);

  useEffect(() => {
    if (!accessToken) {
      return;
    }

    // It is possible for the same song to be selected twice
    // Maybe fix this
    const getUserTracks = async () => {
      const limit = 50;

      const first = await axios.get<TracksResponse>(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (first.data.total <= limit) {
        const tracks = first.data.items.map(({ track }) => track);
        tracksRef.current = tracks;
        setTracks(tracks);
        return;
      }

      const uppedBound = first.data.total - limit;
      const randOffset = Math.floor(Math.random() * uppedBound);

      const response = await axios.get<TracksResponse>(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${randOffset}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const tracks = response.data.items.map(({ track }) => track);
      tracksRef.current = tracks;
      setTracks(tracks);
    };

    const getTopTracks = async () => {
      const response = await axios.get<{ items: Track[] }>(
        "https://api.spotify.com/v1/me/top/tracks?limit=5",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setTopTracks(response.data.items);
    };

    const handleNextRound = (roomData: RoomData) => {
      if (!roomDataRef.current) {
        return;
      }

      handleUpdateRoomData(roomData);

      setShowScores(false);
      setSelectedPlayer(null);
      setShowCorrectAnswer(false);

      setTimeout(() => {
        setShowCorrectAnswer(true);
      }, roomDataRef.current.roundLength);

      setTimeout(() => {
        setShowScores(true);
      }, roomDataRef.current.roundLength + roomDataRef.current.showCorrectAnswerTime);
    };

    const handleUpdateRoomData = (roomData: RoomData) => {
      setRoomData(roomData);
      roomDataRef.current = roomData;
    };

    const handlePickNextSong = () => {
      if (!roomDataRef.current) {
        return;
      }

      const randIndex = Math.floor(Math.random() * tracksRef.current.length);
      const track = tracksRef.current[randIndex];
      socket.emit("nextRound", track, roomDataRef.current.roomCode);

      if (
        roomDataRef.current.currentRound >=
        roomDataRef.current.numRounds - 1
      ) {
        return;
      }

      setTimeout(() => {
        if (!roomDataRef.current) {
          return;
        }

        socket.emit("chooseNextPlayer", roomDataRef.current.roomCode);
      }, roomDataRef.current.roundLength + roomDataRef.current.showCorrectAnswerTime + roomDataRef.current.showScoresTime);
    };

    const handleSocketError = (message: string) => {
      toast.error(message);
    };

    getUserTracks();
    getTopTracks();

    socket.on("updateRoomData", handleUpdateRoomData);
    socket.on("pickNextSong", handlePickNextSong);
    socket.on("nextRound", handleNextRound);
    socket.on("error", handleSocketError);

    return () => {
      socket.off("updateRoomData", handleUpdateRoomData);
      socket.off("pickNextSong", handlePickNextSong);
      socket.off("nextRound", handleNextRound);
      socket.off("error", handleSocketError);
    };
  }, [accessToken]);

  const handleSelectPlayer = (playerId: string) => {
    if (!roomDataRef.current) {
      return;
    }

    setSelectedPlayer(playerId);
    socket.emit("selectPlayer", playerId, roomDataRef.current.roomCode);
  };

  const selectLobbyPlayer = (player: Player) => {
    if (
      selectedLobbyPlayer &&
      selectedLobbyPlayer.playerId === player.playerId
    ) {
      return;
    }

    setSelectedLobbyPlayer(player);
  };

  if (!accessToken) {
    return (
      <div className="h-screen flex items-center p-4">
        <div className="mx-auto">
          <LoginCard />
        </div>

        <Toaster position="top-center" />
      </div>
    );
  } else if (tracks.length < 1 || topTracks.length < 1) {
    return (
      <div className="h-screen p-4 flex items-center">
        <div className="mx-auto bg-gray-200 rounded-md p-4 flex items-center gap-4">
          <h1 className="animate-spin">⁐</h1>
          <h1>Getting liked songs...</h1>
        </div>
      </div>
    );
  } else if (!roomData) {
    return (
      <div className="h-screen flex items-center p-4">
        <div className="w-md mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Spotify Roulette</h1>

          <Tabs defaultValue="create">
            <TabsList className="w-full">
              <TabsTrigger className="cursor-pointer" value="create">
                Create
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="join">
                Join
              </TabsTrigger>
            </TabsList>

            <TabsContent value="create">
              <CreateLobbyForm topTracks={topTracks} />
            </TabsContent>

            <TabsContent value="join">
              <JoinLobbyForm topTracks={topTracks} />
            </TabsContent>
          </Tabs>
        </div>

        <Toaster position="top-center" />
      </div>
    );
  } else if (!roomData.currentTrackData) {
    const playersList = Object.values(roomData.players);

    if (!selectedLobbyPlayer) {
      setSelectedLobbyPlayer(playersList[0]);
    }

    return (
      <div className="min-h-screen flex items-center p-4">
        <div className="mx-auto flex flex-col w-md gap-4">
          <h1 className="text-2xl font-bold">
            Join Code : {roomData.roomCode}
          </h1>

          <LobbyPlayersCard
            playersList={playersList}
            selectLobbyPlayer={selectLobbyPlayer}
          />

          {selectedLobbyPlayer ? (
            <TopSongsCard selectedLobbyPlayer={selectedLobbyPlayer} />
          ) : (
            <></>
          )}

          {roomData.hostId === socket.id ? (
            <Button
              onClick={() => socket.emit("chooseNextPlayer", roomData.roomCode)}
              className="cursor-pointer"
            >
              Start Game
            </Button>
          ) : (
            <h1>
              Waiting for {roomData.players[roomData.hostId].username} to
              start...
            </h1>
          )}
        </div>

        <Toaster position="top-center" />
      </div>
    );
  } else if (showScores && roomData.currentRound >= roomData.numRounds) {
    const playersList = Object.values(roomData.players);
    const winner = playersList.reduce(
      (max, player) => (player.score > max.score ? player : max),
      playersList[0]
    );

    return (
      <div className="h-screen flex items-center p-4">
        <div className="mx-auto w-md flex flex-col">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Winner : {winner.username}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {playersList.map(({ username, score }) => (
                <div
                  className="bg-gray-200 p-4 rounded-md flex justify-between"
                  key={crypto.randomUUID()}
                >
                  <p>{username}</p>
                  <p>{score}</p>
                </div>
              ))}
            </CardContent>

            <CardFooter>
              {roomData.hostId === socket.id ? (
                <Button
                  onClick={() => socket.emit("playAgain", roomData.roomCode)}
                  className="w-full cursor-pointer"
                >
                  Play Again
                </Button>
              ) : (
                <></>
              )}
            </CardFooter>
          </Card>
        </div>

        <Toaster position="top-center" />
      </div>
    );
  } else if (showScores) {
    return (
      <div className="h-screen flex items-center p-4">
        <div className="mx-auto w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Round {roomData.currentRound + 1}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {Object.values(roomData.players).map(({ username, score }) => (
                <div
                  className="bg-gray-200 p-4 rounded-md flex justify-between"
                  key={crypto.randomUUID()}
                >
                  <p>{username}</p>
                  <p>{score}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="w-full rounded-full overflow-hidden bg-gray-200 h-4 mb-4">
        <div className="h-full bg-black progress-bar"></div>
      </div>

      <div className="mx-auto max-w-xl flex flex-col gap-4 items-center">
        <div>
          <h1 className="text-2xl font-bold text-center">
            {roomData.currentTrackData.track.album.name}
          </h1>

          <p className="text-gray-500 text-center">
            {roomData.currentTrackData.track.artists[0].name}
          </p>
        </div>

        <Image
          src={roomData.currentTrackData.track.album.images[0].url}
          alt="Album Cover"
          width={400}
          height={400}
          priority
          unoptimized
          className="border-2"
        />

        <h1 className="text-2xl text-center">
          {roomData.currentTrackData.track.name}
        </h1>

        <div className="grid grid-cols-2 w-full gap-4">
          {Object.values(roomData.players).map(({ playerId, username }) => (
            <PlayerSelectionButton
              playerId={playerId}
              username={username}
              canSelect={!selectedPlayer}
              isSelected={selectedPlayer === playerId}
              selectPlayer={handleSelectPlayer}
              showCorrectAnswer={showCorrectAnswer}
              correctPlayerId={
                roomData.currentTrackData?.playerId || "Undefined"
              }
              key={playerId}
            />
          ))}
        </div>
      </div>

      <div className="left-0 right-0 bottom-0 fixed">
        <SongPlayer
          accessToken={accessToken}
          uris={roomData.currentTrackData.track.uri}
        />
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
