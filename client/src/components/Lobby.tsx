import React, { useState } from "react";

interface LobbyProps {
    createGame: (playerName: string) => void;
    joinGame: (id: string, playerName: string) => void;
}

const Lobby: React.FC<LobbyProps> = ({ createGame, joinGame }) => {
    const [gameId, setGameId] = useState("");
    const [playerName, setPlayerName] = useState("");

    const handleCreateGame = () => {
        createGame(playerName);
    };

    const handleJoinGame = () => {
        if (playerName && gameId) {
            joinGame(gameId, playerName);
        }
    };

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">Multiplayer Typing Game</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div className="mb-4">
                <button
                    onClick={handleCreateGame}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                    Create New Game
                </button>
            </div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Enter game ID"
                    value={gameId}
                    onChange={(e) => setGameId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
            <div>
                <button
                    onClick={handleJoinGame}
                    className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                >
                    Join Game
                </button>
            </div>
        </div>
    );
};

export default Lobby;
