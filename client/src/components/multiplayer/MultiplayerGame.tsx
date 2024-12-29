import React, { useState, useEffect } from "react";
import { useParagraph } from "../../helpers/useParagraph";
import Lobby from "../Lobby";
import io, { Socket } from "socket.io-client";
import MultiplayerTest from "./MultiplayerTest";

const socket = io("http://localhost:3001", {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

const MultiplayerGame: React.FC = () => {
    const [gameId, setGameId] = useState<string | null>(null);
    const [players, setPlayers] = useState<string[]>([]);
    const { paragraph } = useParagraph();
    const [gameStarted, setGameStarted] = useState(false);
    const [gameParagraph, setGameParagraph] = useState<string[]>([]);
    const [playerName, setPlayerName] = useState<string>("");

    useEffect(() => {
        socket.on("gameCreated", (id: string) => {
            setGameId(id);
        });

        socket.on(
            "playerJoined",
            (updatedPlayers: string[], gameId: string) => {
                setPlayers(updatedPlayers);
                setGameId(gameId);
            }
        );

        socket.on("gameStarted", (gameParagraph: string[]) => {
            setGameStarted(true);
            setGameParagraph(gameParagraph);
        });

        socket.on("joinError", (error: string) => {
            console.error(error);
            // Handle join error (e.g., show an error message to the user)
        });

        return () => {
            socket.off("gameCreated");
            socket.off("playerJoined");
            socket.off("gameStarted");
            socket.off("joinError");
        };
    }, []);

    const createGame = (playerName: string) => {
        setPlayerName(playerName);
        socket.emit("createGame", playerName);
    };

    const joinGame = (id: string, playerName: string) => {
        setPlayerName(playerName);
        socket.emit("joinGame", { gameId: id, playerName });
    };

    const startGame = () => {
        if (gameId) {
            socket.emit("startGame", { gameId, paragraph });
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {!gameId && <Lobby createGame={createGame} joinGame={joinGame} />}
            {gameId && !gameStarted && (
                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">
                        Waiting for players...
                    </h2>
                    <p className="mb-2">
                        Game ID:{" "}
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {gameId}
                        </span>
                    </p>
                    <p className="mb-4">Players: {players.join(", ")}</p>
                    {players.length >= 2 && (
                        <button
                            onClick={startGame}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        >
                            Start Game
                        </button>
                    )}
                </div>
            )}
            {gameId && gameStarted && (
                <MultiplayerTest
                    gameId={gameId}
                    players={players}
                    paragraph={gameParagraph}
                    socket={socket}
                    playerName={playerName}
                />
            )}
        </div>
    );
};

export default MultiplayerGame;
