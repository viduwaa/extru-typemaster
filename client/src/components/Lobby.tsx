import React, { useState } from "react";
import PopupForm from "./multiplayer/PopupForm";

export interface LobbyProps {
    createGame: (
        playerID: string,
        playerName: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
            selectedAvatar:string
        }
    ) => void;
    joinGame: (
        id: string,
        playerName: string,
        playerID: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
            selectedAvatar:string
        }
    ) => void;
}

const Lobby: React.FC<LobbyProps> = ({ createGame, joinGame }) => {
    const [gameId, setGameId] = useState("");
    const [isOverlayVisible, setIsOverlayVisible] = useState(false);
    const [isCreatingGame, setIsCreatingGame] = useState(false);
    const [warning, setWarning] = useState(false);
    const [vibrating, setVibrating] = useState(false);

    const handleCreateGame = (
        playerName: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
            selectedAvatar:string
        }
    ) => {
        const playerID = Math.random().toString(36).substring(7);
        createGame(playerID, playerName, additionalInfo);
        setIsOverlayVisible(false);
    };

    const handleJoinGame = (
        playerName: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
            selectedAvatar:string
        }
    ) => {
        if (gameId) {
            const playerID = Math.random().toString(36).substring(7);
            joinGame(gameId, playerName, playerID, additionalInfo);
            setIsOverlayVisible(false);
        }
    };

    const showCreateGamePopup = () => {
        setIsCreatingGame(true);
        setIsOverlayVisible(true);
    };

    const showJoinGamePopup = () => {
        if (gameId) {
            setIsCreatingGame(false);
            setIsOverlayVisible(true);
        } else {
            setWarning(true);
            setVibrating(true);
            setTimeout(() => setVibrating(false), 300);
        }
    };

    const handleOutsideClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            setIsOverlayVisible(false);
        }
    };

    return (
        <>
            {isOverlayVisible && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={handleOutsideClick}
                >
                    <PopupForm
                        onSubmit={
                            isCreatingGame ? handleCreateGame : handleJoinGame
                        }
                        onClose={() => setIsOverlayVisible(false)}
                        buttonText={
                            isCreatingGame ? "Create New Game" : "Join Game"
                        }
                    />
                </div>
            )}
            <div className="grid grid-cols-2 gap-2 w-1/2 m-auto">
                <h2 className="text-2xl font-bold text-center col-span-full">
                    EXTRU Type Master 2025
                </h2>
                <div className="h-full w-full bg-white shadow-xl rounded-lg p-6">
                    <button
                        onClick={showCreateGamePopup}
                        className="h-[87px]  block m-auto bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Create New Game
                    </button>
                </div>
                <div className="flex flex-col gap-y-2 bg-white shadow-md rounded-lg p-6">
                    <div className="m-auto">
                        <input
                            type="text"
                            placeholder="Enter game ID"
                            value={gameId}
                            onChange={(e) => setGameId(e.target.value)}
                            className="w-40 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <button
                        onClick={showJoinGamePopup}
                        className="w-40 m-auto bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                    >
                        Join Game
                    </button>
                    {warning && (
                        <div className="mb-4 flex justify-center">
                            <h3
                                className={`text-red-500 ${
                                    vibrating ? "vibrate" : ""
                                }`}
                            >
                                Please Enter a Game ID to Continue
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default Lobby;
