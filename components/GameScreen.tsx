"use client";

import CreateLobbyForm from "@/components/CreateLobbyForm";
import JoinLobbyForm from "@/components/JoinLobbyForm";
import LobbyPlayersCard from "@/components/LobbyPlayersCard";
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
import { Player, LobbyData } from "@/server";
import { socket } from "@/socket";
import axios from "axios";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { LuLoaderCircle } from "react-icons/lu";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
import Header from "./Header";

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
  popularity: number;
};

export type Album = {
  images: AlbumImage[];
  name: string;
  id: string;
};

export type AlbumImage = {
  url: string;
};

export type Artist = {
  name: string;
  images: { url: string }[];
  id: string;
  followers: { total: number };
  genres: string[];
  popularity: number;
};

type Props = {
  accessToken: string;
};

export default function GameScreen({ accessToken }: Props) {
  const [isConnected, setIsConnected] = useState(false);

  const [tracks, setTracks] = useState<Track[]>([]);
  const tracksRef = useRef<Track[]>([]);
  const [topTracks, setTopTracks] = useState<Track[]>([]);
  const [selectedLobbyPlayer, setSelectedLobbyPlayer] = useState<Player | null>(
    null
  );

  const [lobbyData, setLobbyData] = useState<LobbyData | null>(null);
  const lobbyDataRef = useRef<LobbyData | null>(null);

  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);

  const [showScores, setShowScores] = useState(false);

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    if (socket.connected) {
      setIsConnected(true);
    } else {
      socket.on("connect", handleConnect);
    }

    socket.on("disconnect", handleDisconnect);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);

  useEffect(() => {
    if (!isConnected) {
      return;
    }

    // It is possible for the same song to be selected twice
    // Maybe fix this
    const getUserTracks = async () => {
      const limit = 50;

      const initialResponse = await axios.get<TracksResponse>(
        `https://api.spotify.com/v1/me/tracks?limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (initialResponse.data.total <= limit) {
        const tracks = initialResponse.data.items.map(({ track }) => track);
        tracksRef.current = tracks;
        setTracks(tracks);
        return;
      }

      const uppedBound = initialResponse.data.total - limit;
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

    const handleStartNextRound = (lobbyData: LobbyData) => {
      if (!lobbyDataRef.current) {
        return;
      }

      handleUpdateLobbyData(lobbyData);

      setShowScores(false);
      setSelectedPlayer(null);
      setShowCorrectAnswer(false);

      setTimeout(() => {
        setShowCorrectAnswer(true);
      }, lobbyDataRef.current.roundLength);

      setTimeout(() => {
        setShowScores(true);
      }, lobbyDataRef.current.roundLength + lobbyDataRef.current.showCorrectAnswerTime);
    };

    const handleUpdateLobbyData = (lobbyData: LobbyData) => {
      setLobbyData(lobbyData);
      lobbyDataRef.current = lobbyData;
    };

    const handlePickNextSong = () => {
      if (!lobbyDataRef.current) {
        return;
      }

      const randIndex = Math.floor(Math.random() * tracksRef.current.length);
      const track = tracksRef.current[randIndex];
      socket.emit("startNextRound", track, lobbyDataRef.current.joinCode);
    };

    const handleSocketError = (message: string) => {
      toast.error(message);
    };

    getUserTracks();
    getTopTracks();

    socket.on("updateLobbyData", handleUpdateLobbyData);
    socket.on("pickNextSong", handlePickNextSong);
    socket.on("startNextRound", handleStartNextRound);
    socket.on("error", handleSocketError);

    return () => {
      socket.off("updateLobbyData", handleUpdateLobbyData);
      socket.off("pickNextSong", handlePickNextSong);
      socket.off("startNextRound", handleStartNextRound);
      socket.off("error", handleSocketError);
    };
  }, [accessToken, isConnected]);

  const handleSelectPlayer = (playerId: string) => {
    if (!lobbyDataRef.current) {
      return;
    }

    setSelectedPlayer(playerId);
    socket.emit("selectPlayer", playerId, lobbyDataRef.current.joinCode);
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

  const leaveLobby = () => {
    if (!lobbyData) {
      return;
    }

    socket.emit("leaveLobby", lobbyData.joinCode, () => setLobbyData(null));
  };

  // const toggleKeepListening = (checked: boolean) => {
  //   console.log(checked);
  // };

  if (!isConnected) {
    return (
      <div className="min-h-screen p-4 flex items-center">
        <div className="mx-auto bg-gray-200 rounded-md p-4 flex items-center gap-2">
          <LuLoaderCircle className="animate-spin text-2xl" />

          <h1>Connecting...</h1>
        </div>
      </div>
    );
  } else if (tracks.length < 1 || topTracks.length < 1) {
    return (
      <div className="min-h-screen p-4 flex items-center">
        <div className="mx-auto bg-gray-200 rounded-md p-4 flex items-center gap-2">
          <LuLoaderCircle className="animate-spin text-2xl" />

          <h1>Getting liked songs...</h1>
        </div>
      </div>
    );
  } else if (!lobbyData) {
    return (
      <>
        <Header />

        <div className="min-h-screen flex items-center p-4">
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
      </>
    );
  } else if (!lobbyData.currentTrackData) {
    const playersList = Object.values(lobbyData.players);

    if (!selectedLobbyPlayer) {
      setSelectedLobbyPlayer(playersList[0]);
    }

    return (
      <div className="min-h-screen flex items-center p-4">
        <div className="mx-auto flex flex-col w-md gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Join Code : {lobbyData.joinCode}
            </h1>

            <p className="text-gray-500">
              Number of rounds : {lobbyData.numRounds}
            </p>

            <p className="text-gray-500">
              Round Length : {lobbyData.roundLength / 1000} seconds
            </p>
          </div>

          <LobbyPlayersCard
            playersList={playersList}
            selectLobbyPlayer={selectLobbyPlayer}
          />

          {selectedLobbyPlayer ? (
            <TopSongsCard selectedLobbyPlayer={selectedLobbyPlayer} />
          ) : (
            <></>
          )}

          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={leaveLobby}
          >
            Leave Lobby
          </Button>

          {lobbyData.hostId === socket.id ? (
            <Button
              onClick={() =>
                socket.emit("chooseNextPlayer", lobbyData.joinCode)
              }
              className="cursor-pointer"
            >
              Start Game
            </Button>
          ) : (
            <h1>
              Waiting for {lobbyData.players[lobbyData.hostId].username} to
              start...
            </h1>
          )}
        </div>

        <Toaster position="top-center" />
      </div>
    );
  } else if (showScores && lobbyData.currentRound >= lobbyData.numRounds) {
    const playersList = Object.values(lobbyData.players);
    const winner = playersList.reduce(
      (max, player) => (player.score > max.score ? player : max),
      playersList[0]
    );

    return (
      <div className="min-h-screen flex items-center p-4">
        <div className="mx-auto w-md flex flex-col">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Winner : {winner.username}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {playersList.map(({ username, score, playerId }) => (
                <div
                  className="bg-gray-200 p-4 rounded-md flex justify-between"
                  key={playerId}
                >
                  <p>{username}</p>
                  <p>{score}</p>
                </div>
              ))}
            </CardContent>

            <CardFooter className="flex flex-col gap-4">
              <Button
                className="cursor-pointer w-full"
                variant="secondary"
                onClick={leaveLobby}
              >
                Leave Lobby
              </Button>

              {lobbyData.hostId === socket.id ? (
                <Button
                  onClick={() => socket.emit("playAgain", lobbyData.joinCode)}
                  className="w-full cursor-pointer"
                >
                  Play Again
                </Button>
              ) : (
                <>
                  <h1>
                    Waiting for {lobbyData.players[lobbyData.hostId].username}{" "}
                    to play again...
                  </h1>
                </>
              )}
            </CardFooter>
          </Card>
        </div>

        <Toaster position="top-center" />
      </div>
    );
  } else if (showScores) {
    return (
      <div className="min-h-screen flex items-center p-4">
        <div className="mx-auto w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-2xl font-bold">
                Round {lobbyData.currentRound + 1}
              </CardTitle>
            </CardHeader>

            <CardContent className="flex flex-col gap-4">
              {Object.values(lobbyData.players).map(
                ({ username, score, playerId }) => (
                  <div
                    className="bg-gray-200 p-4 rounded-md flex justify-between"
                    key={playerId}
                  >
                    <p>{username}</p>
                    <p>{score}</p>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>

        <Toaster position="top-center" />
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col justify-between">
        <div className="flex flex-col gap-4 p-4">
          <div className="w-full rounded-full overflow-hidden bg-gray-200 h-4">
            <div
              className="h-full bg-black round-timer"
              style={
                {
                  "--round-timer-duration": `${lobbyData.roundLength / 1000}s`,
                } as React.CSSProperties
              }
            ></div>
          </div>

          <div className="mx-auto w-md max-w-full flex flex-col gap-4 items-center">
            <div className="max-w-full flex flex-col items-center">
              <div className="w-[200px] md:w-[300px] lg:w-[400px] aspect-square max-w-full relative border-2">
                <Image
                  src={
                    lobbyData.currentTrackData.track.album.images[0]?.url ||
                    "/SpotifyLogo.png"
                  }
                  alt="Album Cover"
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div>
                <h1 className="text-2xl font-bold text-center line-clamp-1">
                  {lobbyData.currentTrackData.track.name}
                </h1>

                <p className="text-gray-500 text-center">
                  {lobbyData.currentTrackData.track.artists[0].name}
                </p>
              </div>
            </div>

            {/* {showCorrectAnswer &&
            lobbyData.currentTrackData.playerId === socket.id ? (
              <div className="flex items-center gap-2">
                <Switch
                  className="w-[48px] h-[28px] [&>span]:w-[24px] [&>span]:h-[24px] cursor-pointer"
                  id="keep-listening"
                  onCheckedChange={toggleKeepListening}
                />
                <Label className="text-lg" htmlFor="keep-listening">
                  Keep Listening
                </Label>
              </div>
            ) : (
              <></>
            )} */}

            <div className="grid grid-cols-2 gap-2 w-full">
              {Object.values(lobbyData.players).map(
                ({ playerId, username }) => (
                  <PlayerSelectionButton
                    playerId={playerId}
                    username={username}
                    canSelect={!selectedPlayer}
                    isSelected={selectedPlayer === playerId}
                    selectPlayer={handleSelectPlayer}
                    showCorrectAnswer={showCorrectAnswer}
                    correctPlayerId={
                      lobbyData.currentTrackData?.playerId || "Undefined"
                    }
                    key={playerId}
                  />
                )
              )}
            </div>
          </div>
        </div>

        <SongPlayer
          accessToken={accessToken}
          uris={lobbyData.currentTrackData.track.uri}
        />
      </div>

      <Toaster position="top-center" />
    </div>
  );
}
