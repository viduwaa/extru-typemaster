import React, { useState, useEffect } from "react";
import { useParagraph } from "../../helpers/useParagraph";
import Lobby from "../Lobby";
import io from "socket.io-client";
import MultiplayerTest from "./MultiplayerTest";
import { LobbyProps } from "../Lobby";
import { useLoader } from '../../utils/LoaderContext';

const socket = io("http://localhost:3011", {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

interface Player {
    id: string;
    name: string;
    avatar: string;
}

const MultiplayerGame: React.FC = () => {
    const [gameId, setGameId] = useState<string | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const { paragraph,isLoading } = useParagraph();
    const [gameStarted, setGameStarted] = useState(false);
    const [gameParagraph, setGameParagraph] = useState<string[]>([]);
    const [playerName, setPlayerName] = useState<string>("");
    const [currentPlayer, setCurrentPlayer] = useState<{ id: string; name: string } | null>(null);
    const { showLoader, hideLoader } = useLoader();

    useEffect(() => {
        if (isLoading) {
          showLoader(); 
        } else {
          hideLoader();
          
        }
      }, [isLoading, paragraph, showLoader, hideLoader]);

    useEffect(() => {
        socket.on("gameCreated", (id: string) => {
            setGameId(id);
        });

        socket.on(
            "playerJoined",
            (
                updatedPlayers: { id: string; name: string; avatar: string }[],
                gameId: string,
            ) => {
                setPlayers(updatedPlayers);
                setGameId(gameId);
            },
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

    const createGame: LobbyProps["createGame"] = (
        playerID,
        playerName,
        additionalInfo,
    ) => {
        setPlayerName(playerName);
        setCurrentPlayer({ id: playerID, name: playerName });
        setPlayers([
            {
                id: playerID,
                name: playerName,
                avatar: additionalInfo.selectedAvatar,
            },
        ]);
        console.log(playerID, playerName, additionalInfo);
        socket.emit("createGame", { playerID, playerName, additionalInfo });
    };

    const joinGame: LobbyProps["joinGame"] = (
        gameId,
        playerName,
        playerID,
        additionalInfo,
    ) => {
        setPlayerName(playerName);
        setCurrentPlayer({ id: playerID, name: playerName });
        socket.emit("joinGame", {
            gameId,
            playerName,
            playerID,
            additionalInfo,
        });
    };

    const startGame = () => {
        if (gameId) {
            socket.emit("startGame", { gameId, paragraph });
        }
    };

    return (
        <div className="container relative mx-auto px-4 py-8">
            {!gameId && <Lobby createGame={createGame} joinGame={joinGame} />}
            {gameId && !gameStarted && (
                <div className="rounded-lg bg-white p-6 shadow-md">
                    <h2 className="mb-4 text-2xl font-bold">
                        Waiting for players...
                    </h2>
                    <p className="mb-2">
                        Game ID:{" "}
                        <span className="rounded bg-gray-100 px-2 py-1 font-mono">
                            {gameId}
                        </span>
                    </p>
                    <p className="mb-4">Players: </p>
                   
                    <div className="flex">
                        {players.map((player) => (
                            <div
                                className="flex flex-col items-center gap-2"
                                key={player.id}
                            >
                                <img
                                    src={player.avatar}
                                    className="h-28 w-28 rounded-full"
                                />
                                <span className="font-semibold">{player.name}</span>
                            </div>
                        ))}
                    </div>

                    {players.length >= 2 && (
                        <button
                            onClick={startGame}
                            className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
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
                    currentPlayer={currentPlayer}
                />
            )}
        </div>
    );
};

export default MultiplayerGame;
