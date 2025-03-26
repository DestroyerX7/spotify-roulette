"use strict";
import { createServer } from "node:http";
import next from "next";
import { Server } from "socket.io";
import dotenv from "dotenv";
dotenv.config();
const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME;
const port = (process.env.PORT || 3000);
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();
const rooms = {};
function generateRandomString(length = 6) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
function chooseNextPlayer(roomCode, io) {
    if (rooms[roomCode].currentRound >= rooms[roomCode].numRounds) {
        return;
    }
    const playersList = Object.values(rooms[roomCode].players);
    const playerIndex = Math.floor(Math.random() * playersList.length);
    io.to(playersList[playerIndex].playerId).emit("pickNextSong");
}
function playAgain(roomCode, io) {
    rooms[roomCode].currentRound = 0;
    rooms[roomCode].currentTrackData = null;
    rooms[roomCode].roundStartTime = null;
    for (const player of Object.values(rooms[roomCode].players)) {
        player.answeredTime = null;
        player.score = 0;
    }
    io.to(roomCode).emit("updateRoomData", rooms[roomCode]);
    chooseNextPlayer(roomCode, io);
}
app.prepare().then(() => {
    const httpServer = createServer(handler);
    const io = new Server(httpServer);
    io.on("connection", (socket) => {
        socket.on("createRoom", (username, topTracks) => {
            const roomCode = generateRandomString();
            socket.join(roomCode);
            const player = {
                playerId: socket.id,
                username: username,
                score: 0,
                answeredTime: null,
                topTracks: topTracks,
            };
            rooms[roomCode] = {
                players: { [socket.id]: player },
                roomCode: roomCode,
                hostId: socket.id,
                currentRound: 0,
                roundStartTime: null,
                currentTrackData: null,
                numRounds: 10,
                roundLength: 10000,
                showScoresTime: 2500,
                showCorrectAnswerTime: 2500,
            };
            io.to(roomCode).emit("updateRoomData", rooms[roomCode]);
        });
        socket.on("joinRoom", (roomCode, username, topTracks) => {
            if (!(roomCode in rooms)) {
                socket.emit("error", "Join code not found");
                return;
            }
            socket.join(roomCode);
            const player = {
                playerId: socket.id,
                username: username,
                score: 0,
                answeredTime: null,
                topTracks: topTracks,
            };
            rooms[roomCode].players[socket.id] = player;
            io.to(roomCode).emit("updateRoomData", rooms[roomCode]);
        });
        socket.on("nextRound", (track, roomCode) => {
            if (rooms[roomCode].currentRound >= rooms[roomCode].numRounds) {
                return;
            }
            for (const player of Object.values(rooms[roomCode].players)) {
                player.answeredTime = null;
            }
            rooms[roomCode].currentRound++;
            rooms[roomCode].roundStartTime = Date.now();
            rooms[roomCode].currentTrackData = {
                track: track,
                playerId: socket.id,
            };
            io.to(roomCode).emit("nextRound", rooms[roomCode]);
        });
        socket.on("chooseNextPlayer", (roomCode) => {
            chooseNextPlayer(roomCode, io);
        });
        socket.on("selectPlayer", (selectedPlayerId, roomCode) => {
            if (!rooms[roomCode].roundStartTime ||
                !rooms[roomCode].currentTrackData) {
                return;
            }
            const answeredTime = Date.now() - rooms[roomCode].roundStartTime;
            if (selectedPlayerId === rooms[roomCode].currentTrackData.playerId) {
                const points = Math.max(0, rooms[roomCode].roundLength - answeredTime);
                rooms[roomCode].players[socket.id].score += points;
            }
            rooms[roomCode].players[socket.id].answeredTime = answeredTime;
            io.to(roomCode).emit("updateRoomData", rooms[roomCode]);
        });
        socket.on("playAgain", (roomCode) => {
            playAgain(roomCode, io);
        });
        socket.on("disconnect", () => {
            for (const [roomCode, room] of Object.entries(rooms)) {
                const keys = Object.keys(room.players);
                if (!keys.includes(socket.id)) {
                    continue;
                }
                delete room.players[socket.id];
                if (Object.entries(room.players).length === 0) {
                    delete rooms[roomCode];
                }
                else {
                    io.to(roomCode).emit("updateRoomData", room);
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
