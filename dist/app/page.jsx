"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Home;
const CreateLobbyForm_1 = __importDefault(require("@/components/CreateLobbyForm"));
const JoinLobbyForm_1 = __importDefault(require("@/components/JoinLobbyForm"));
const LobbyPlayersCard_1 = __importDefault(require("@/components/LobbyPlayersCard"));
const LoginCard_1 = __importDefault(require("@/components/LoginCard"));
const PlayerSelectionButton_1 = __importDefault(require("@/components/PlayerSelectionButton"));
const SongPlayer_1 = __importDefault(require("@/components/SongPlayer"));
const TopSongsCard_1 = __importDefault(require("@/components/TopSongsCard"));
const button_1 = require("@/components/ui/button");
const card_1 = require("@/components/ui/card");
const tabs_1 = require("@/components/ui/tabs");
const useAuth_1 = __importDefault(require("@/lib/useAuth"));
const socket_1 = require("@/socket");
const axios_1 = __importDefault(require("axios"));
const image_1 = __importDefault(require("next/image"));
const navigation_1 = require("next/navigation");
const react_1 = require("react");
const sonner_1 = require("sonner");
function Home() {
    const searchParams = (0, navigation_1.useSearchParams)();
    const code = searchParams.get("code");
    const [tracks, setTracks] = (0, react_1.useState)([]);
    const tracksRef = (0, react_1.useRef)([]);
    const [topTracks, setTopTracks] = (0, react_1.useState)([]);
    const [selectedLobbyPlayer, setSelectedLobbyPlayer] = (0, react_1.useState)(null);
    const [roomData, setRoomData] = (0, react_1.useState)(null);
    const roomDataRef = (0, react_1.useRef)(null);
    const [selectedPlayer, setSelectedPlayer] = (0, react_1.useState)(null);
    const [showCorrectAnswer, setShowCorrectAnswer] = (0, react_1.useState)(false);
    const [showScores, setShowScores] = (0, react_1.useState)(false);
    const accessToken = (0, useAuth_1.default)(code);
    (0, react_1.useEffect)(() => {
        if (!accessToken) {
            return;
        }
        // It is possible for the same song to be selected twice
        // Maybe fix this
        const getUserTracks = async () => {
            const limit = 50;
            const first = await axios_1.default.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            if (first.data.total <= limit) {
                const tracks = first.data.items.map(({ track }) => track);
                tracksRef.current = tracks;
                setTracks(tracks);
                return;
            }
            const uppedBound = first.data.total - limit;
            const randOffset = Math.floor(Math.random() * uppedBound);
            const response = await axios_1.default.get(`https://api.spotify.com/v1/me/tracks?limit=${limit}&offset=${randOffset}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            const tracks = response.data.items.map(({ track }) => track);
            tracksRef.current = tracks;
            setTracks(tracks);
        };
        const getTopTracks = async () => {
            const response = await axios_1.default.get("https://api.spotify.com/v1/me/top/tracks?limit=5", {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            });
            setTopTracks(response.data.items);
        };
        const handleNextRound = (roomData) => {
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
        const handleUpdateRoomData = (roomData) => {
            setRoomData(roomData);
            roomDataRef.current = roomData;
        };
        const handlePickNextSong = () => {
            if (!roomDataRef.current) {
                return;
            }
            const randIndex = Math.floor(Math.random() * tracksRef.current.length);
            const track = tracksRef.current[randIndex];
            socket_1.socket.emit("nextRound", track, roomDataRef.current.roomCode);
            if (roomDataRef.current.currentRound >=
                roomDataRef.current.numRounds - 1) {
                return;
            }
            setTimeout(() => {
                if (!roomDataRef.current) {
                    return;
                }
                socket_1.socket.emit("chooseNextPlayer", roomDataRef.current.roomCode);
            }, roomDataRef.current.roundLength + roomDataRef.current.showCorrectAnswerTime + roomDataRef.current.showScoresTime);
        };
        const handleSocketError = (message) => {
            sonner_1.toast.error(message);
        };
        getUserTracks();
        getTopTracks();
        socket_1.socket.on("updateRoomData", handleUpdateRoomData);
        socket_1.socket.on("pickNextSong", handlePickNextSong);
        socket_1.socket.on("nextRound", handleNextRound);
        socket_1.socket.on("error", handleSocketError);
        return () => {
            socket_1.socket.off("updateRoomData", handleUpdateRoomData);
            socket_1.socket.off("pickNextSong", handlePickNextSong);
            socket_1.socket.off("nextRound", handleNextRound);
            socket_1.socket.off("error", handleSocketError);
        };
    }, [accessToken]);
    const handleSelectPlayer = (playerId) => {
        if (!roomDataRef.current) {
            return;
        }
        setSelectedPlayer(playerId);
        socket_1.socket.emit("selectPlayer", playerId, roomDataRef.current.roomCode);
    };
    const selectLobbyPlayer = (player) => {
        if (selectedLobbyPlayer &&
            selectedLobbyPlayer.playerId === player.playerId) {
            return;
        }
        setSelectedLobbyPlayer(player);
    };
    if (!accessToken) {
        return (<div className="h-screen flex items-center p-4">
        <div className="mx-auto">
          <LoginCard_1.default />
        </div>

        <sonner_1.Toaster position="top-center"/>
      </div>);
    }
    else if (tracks.length < 1 || topTracks.length < 1) {
        return (<div className="h-screen p-4 flex items-center">
        <div className="mx-auto bg-gray-200 rounded-md p-4 flex items-center gap-4">
          <h1 className="animate-spin">⁐</h1>
          <h1>Getting liked songs...</h1>
        </div>
      </div>);
    }
    else if (!roomData) {
        return (<div className="h-screen flex items-center p-4">
        <div className="w-md mx-auto flex flex-col gap-4">
          <h1 className="text-2xl font-bold">Spotify Roulette</h1>

          <tabs_1.Tabs defaultValue="create">
            <tabs_1.TabsList className="w-full">
              <tabs_1.TabsTrigger className="cursor-pointer" value="create">
                Create
              </tabs_1.TabsTrigger>
              <tabs_1.TabsTrigger className="cursor-pointer" value="join">
                Join
              </tabs_1.TabsTrigger>
            </tabs_1.TabsList>

            <tabs_1.TabsContent value="create">
              <CreateLobbyForm_1.default topTracks={topTracks}/>
            </tabs_1.TabsContent>

            <tabs_1.TabsContent value="join">
              <JoinLobbyForm_1.default topTracks={topTracks}/>
            </tabs_1.TabsContent>
          </tabs_1.Tabs>
        </div>

        <sonner_1.Toaster position="top-center"/>
      </div>);
    }
    else if (!roomData.currentTrackData) {
        const playersList = Object.values(roomData.players);
        if (!selectedLobbyPlayer) {
            setSelectedLobbyPlayer(playersList[0]);
        }
        return (<div className="min-h-screen flex items-center p-4">
        <div className="mx-auto flex flex-col w-md gap-4">
          <h1 className="text-2xl font-bold">
            Join Code : {roomData.roomCode}
          </h1>

          <LobbyPlayersCard_1.default playersList={playersList} selectLobbyPlayer={selectLobbyPlayer}/>

          {selectedLobbyPlayer ? (<TopSongsCard_1.default selectedLobbyPlayer={selectedLobbyPlayer}/>) : (<></>)}

          {roomData.hostId === socket_1.socket.id ? (<button_1.Button onClick={() => socket_1.socket.emit("chooseNextPlayer", roomData.roomCode)} className="cursor-pointer">
              Start Game
            </button_1.Button>) : (<h1>
              Waiting for {roomData.players[roomData.hostId].username} to
              start...
            </h1>)}
        </div>

        <sonner_1.Toaster position="top-center"/>
      </div>);
    }
    else if (showScores && roomData.currentRound >= roomData.numRounds) {
        const playersList = Object.values(roomData.players);
        const winner = playersList.reduce((max, player) => (player.score > max.score ? player : max), playersList[0]);
        return (<div className="h-screen flex items-center p-4">
        <div className="mx-auto w-md flex flex-col">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="text-center text-2xl font-bold">
                Winner : {winner.username}
              </card_1.CardTitle>
            </card_1.CardHeader>

            <card_1.CardContent className="flex flex-col gap-4">
              {playersList.map(({ username, score }) => (<div className="bg-gray-200 p-4 rounded-md flex justify-between" key={crypto.randomUUID()}>
                  <p>{username}</p>
                  <p>{score}</p>
                </div>))}
            </card_1.CardContent>

            <card_1.CardFooter>
              {roomData.hostId === socket_1.socket.id ? (<button_1.Button onClick={() => socket_1.socket.emit("playAgain", roomData.roomCode)} className="w-full cursor-pointer">
                  Play Again
                </button_1.Button>) : (<></>)}
            </card_1.CardFooter>
          </card_1.Card>
        </div>

        <sonner_1.Toaster position="top-center"/>
      </div>);
    }
    else if (showScores) {
        return (<div className="h-screen flex items-center p-4">
        <div className="mx-auto w-md">
          <card_1.Card>
            <card_1.CardHeader>
              <card_1.CardTitle className="text-center text-2xl font-bold">
                Round {roomData.currentRound + 1}
              </card_1.CardTitle>
            </card_1.CardHeader>

            <card_1.CardContent className="flex flex-col gap-4">
              {Object.values(roomData.players).map(({ username, score }) => (<div className="bg-gray-200 p-4 rounded-md flex justify-between" key={crypto.randomUUID()}>
                  <p>{username}</p>
                  <p>{score}</p>
                </div>))}
            </card_1.CardContent>
          </card_1.Card>
        </div>

        <sonner_1.Toaster position="top-center"/>
      </div>);
    }
    return (<div className="p-4">
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

        <image_1.default src={roomData.currentTrackData.track.album.images[0].url} alt="Album Cover" width={400} height={400} priority unoptimized className="border-2"/>

        <h1 className="text-2xl text-center">
          {roomData.currentTrackData.track.name}
        </h1>

        <div className="grid grid-cols-2 w-full gap-4">
          {Object.values(roomData.players).map(({ playerId, username }) => {
            var _a;
            return (<PlayerSelectionButton_1.default playerId={playerId} username={username} canSelect={!selectedPlayer} isSelected={selectedPlayer === playerId} selectPlayer={handleSelectPlayer} showCorrectAnswer={showCorrectAnswer} correctPlayerId={((_a = roomData.currentTrackData) === null || _a === void 0 ? void 0 : _a.playerId) || "Undefined"} key={playerId}/>);
        })}
        </div>
      </div>

      <div className="left-0 right-0 bottom-0 fixed">
        <SongPlayer_1.default accessToken={accessToken} uris={roomData.currentTrackData.track.uri}/>
      </div>

      <sonner_1.Toaster position="top-center"/>
    </div>);
}
