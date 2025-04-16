import React, { useState } from "react";
import PopupForm from "./multiplayer/PopupForm";
import GlowingLogo from "../utils/GlowingLogo";
import typeMasterLogo from "../assets/logos/TypeMasterLogo.webp";

export interface LobbyProps {
  createGame: (
    playerID: string,
    playerName: string,
    additionalInfo: {
      university: string;
      role: string;
      isSchoolStudent: boolean;
      selectedAvatar: string;
    },
  ) => void;
  joinGame: (
    id: string,
    playerName: string,
    playerID: string,
    additionalInfo: {
      university: string;
      role: string;
      isSchoolStudent: boolean;
      selectedAvatar: string;
    },
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
      selectedAvatar: string;
    },
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
      selectedAvatar: string;
    },
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
          className="fixed inset-0 z-40 bg-black bg-opacity-50"
          onClick={handleOutsideClick}
        >
          <PopupForm
            onSubmit={isCreatingGame ? handleCreateGame : handleJoinGame}
            onClose={() => setIsOverlayVisible(false)}
            buttonText={isCreatingGame ? "Create New Game" : "Join Game"}
          />
        </div>
      )}
      <div className="flex h-60 w-full mb-3 items-center justify-center">
          <GlowingLogo src={typeMasterLogo} alt="logo" />
        </div>  
      <div className="m-auto grid w-1/2 grid-cols-2 gap-2">
        <h2 className="col-span-full text-center text-2xl font-bold">
          EXTRU Type Master 2025
        </h2>
        <div className="h-full w-full rounded-lg bg-white p-6 shadow-xl">
          <button
            onClick={showCreateGamePopup}
            className="m-auto block h-[87px] rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-600"
          >
            Create New Game
          </button>
        </div>
        <div className="flex flex-col gap-y-2 rounded-lg bg-white p-6 shadow-md">
          <div className="m-auto">
            <input
              type="text"
              placeholder="Enter game ID"
              value={gameId}
              onChange={(e) => setGameId(e.target.value)}
              className="w-40 rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <button
            onClick={showJoinGamePopup}
            className="m-auto w-40 rounded bg-green-500 px-4 py-2 font-bold text-white hover:bg-green-600"
          >
            Join Game
          </button>
          {warning && (
            <div className="mb-4 flex justify-center">
              <h3 className={`text-red-500 ${vibrating ? "vibrate" : ""}`}>
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
