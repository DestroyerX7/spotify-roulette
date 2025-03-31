import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";
import { Track } from "./components/GameScreen";

export type LobbyData = {
  players: { [playerId: string]: Player };
  joinCode: string;
  hostId: string;
  roundStartTime: number | null;
  currentRound: number;
  currentTrackData: TrackData | null;
  roundLength: number;
  showCorrectAnswerTime: number;
  showScoresTime: number;
  numRounds: number;
};

export type TrackData = {
  track: Track;
  playerId: string;
};

export type Player = {
  playerId: string;
  username: string;
  score: number;
  answeredTime: number | null;
  topTracks: Track[];
};

dotenv.config();

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME;
const port = (process.env.PORT || 3000) as number;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

const lobbies: { [joinCode: string]: LobbyData } = {};

const showScoresTime = 2500;
const showCorrectAnswerTime = 2500;

function generateJoinCode(length = 6) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function chooseNextPlayer(joinCode: string, io: Server) {
  if (lobbies[joinCode].currentRound >= lobbies[joinCode].numRounds) {
    return;
  }

  const playersList = Object.values(lobbies[joinCode].players);
  const playerIndex = Math.floor(Math.random() * playersList.length);

  io.to(playersList[playerIndex].playerId).emit("pickNextSong");
}

function playAgain(joinCode: string, io: Server) {
  lobbies[joinCode].currentRound = 0;
  lobbies[joinCode].currentTrackData = null;
  lobbies[joinCode].roundStartTime = null;

  for (const player of Object.values(lobbies[joinCode].players)) {
    player.answeredTime = null;
    player.score = 0;
  }

  io.to(joinCode).emit("updateLobbyData", lobbies[joinCode]);

  chooseNextPlayer(joinCode, io);
}

function startNextRound(
  joinCode: string,
  track: Track,
  playerId: string,
  io: Server
) {
  if (lobbies[joinCode].currentRound >= lobbies[joinCode].numRounds) {
    return;
  }

  for (const player of Object.values(lobbies[joinCode].players)) {
    player.answeredTime = null;
  }

  lobbies[joinCode].currentRound++;
  lobbies[joinCode].roundStartTime = Date.now();
  lobbies[joinCode].currentTrackData = {
    track: track,
    playerId: playerId,
  };

  io.to(joinCode).emit("startNextRound", lobbies[joinCode]);

  if (lobbies[joinCode].currentRound >= lobbies[joinCode].numRounds) {
    return;
  }

  setTimeout(() => {
    if (!(joinCode in lobbies)) {
      return;
    }

    chooseNextPlayer(joinCode, io);
  }, lobbies[joinCode].roundLength + lobbies[joinCode].showCorrectAnswerTime + lobbies[joinCode].showScoresTime);
}

// If the host leaves the lobby then no one can start the game
function leaveLobby(
  joinCode: string,
  onLeaveLobby: () => void,
  playerId: string,
  io: Server
) {
  delete lobbies[joinCode].players[playerId];

  if (Object.entries(lobbies[joinCode].players).length === 0) {
    delete lobbies[joinCode];
  } else {
    io.to(joinCode).emit("updateLobbyData", lobbies[joinCode]);
  }

  onLeaveLobby();
}

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    socket.on("createLobby", (username, numRounds, roundLength, topTracks) => {
      const joinCode = generateJoinCode();
      socket.join(joinCode);

      const player = {
        playerId: socket.id,
        username: username,
        score: 0,
        answeredTime: null,
        topTracks: topTracks,
      };

      lobbies[joinCode] = {
        players: { [socket.id]: player },
        joinCode: joinCode,
        hostId: socket.id,
        currentRound: 0,
        roundStartTime: null,
        currentTrackData: null,
        numRounds: numRounds,
        roundLength: roundLength,
        showScoresTime: showScoresTime,
        showCorrectAnswerTime: showCorrectAnswerTime,
      };

      io.to(joinCode).emit("updateLobbyData", lobbies[joinCode]);
    });

    socket.on("joinLobby", (joinCode, username, topTracks) => {
      if (!(joinCode in lobbies)) {
        socket.emit("error", "Join code not found");
        return;
      }

      socket.join(joinCode);

      const player = {
        playerId: socket.id,
        username: username,
        score: 0,
        answeredTime: null,
        topTracks: topTracks,
      };

      lobbies[joinCode].players[socket.id] = player;
      io.to(joinCode).emit("updateLobbyData", lobbies[joinCode]);
    });

    socket.on("startNextRound", (track, joinCode) => {
      startNextRound(joinCode, track, socket.id, io);
    });

    socket.on("chooseNextPlayer", (joinCode) => {
      chooseNextPlayer(joinCode, io);
    });

    socket.on("selectPlayer", (selectedPlayerId, joinCode) => {
      if (
        !lobbies[joinCode].roundStartTime ||
        !lobbies[joinCode].currentTrackData
      ) {
        return;
      }

      const answeredTime = Date.now() - lobbies[joinCode].roundStartTime;

      if (selectedPlayerId === lobbies[joinCode].currentTrackData.playerId) {
        const points = Math.max(
          0,
          lobbies[joinCode].roundLength - answeredTime
        );
        lobbies[joinCode].players[socket.id].score += points;
      }

      lobbies[joinCode].players[socket.id].answeredTime = answeredTime;

      io.to(joinCode).emit("updateLobbyData", lobbies[joinCode]);
    });

    socket.on("playAgain", (joinCode) => {
      playAgain(joinCode, io);
    });

    socket.on("leaveLobby", (joinCode, onLeaveLobby) => {
      leaveLobby(joinCode, onLeaveLobby, socket.id, io);
    });

    socket.on("disconnect", () => {
      for (const lobbyData of Object.values(lobbies)) {
        const playersList = Object.keys(lobbyData.players);

        if (playersList.includes(socket.id)) {
          leaveLobby(lobbyData.joinCode, () => {}, socket.id, io);
        }
      }
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
