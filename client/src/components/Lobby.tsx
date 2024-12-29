import React, { useState } from "react";

interface LobbyProps {
    createGame: (
        playerID: string,
        playerName: string,
        additionalInfo: {
            university: string;
            role: string;
            isSchoolStudent: boolean;
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
        }
    ) => void;
}

const Lobby: React.FC<LobbyProps> = ({ createGame, joinGame }) => {
    const [gameId, setGameId] = useState("");
    const [playerName, setPlayerName] = useState("");
    const [playerID, setPlayerID] = useState("");
    const [university, setUniversity] = useState("");
    const [role, setRole] = useState("");
    const [isSchoolStudent, setIsSchoolStudent] = useState(false);

    const handleCreateGame = () => {
        const uniqueId = Math.random().toString(36).substring(7);
        setPlayerID(uniqueId);
        createGame(playerID,playerName, { university, role, isSchoolStudent });
    };

    const handleJoinGame = () => {
        if (playerName && gameId) {
            const uniqueId = Math.random().toString(36).substring(7);
            setPlayerID(uniqueId);
            joinGame(gameId, playerID, playerName, { university, role, isSchoolStudent });
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
                <select
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select university (optional)</option>
                    <option value="RUSL">
                        Rajarata University of Sri Lanka
                    </option>
                    <option value="UoC">University of Colombo</option>
                    <option value="UoP">University of Peradeniya</option>
                    <option value="UoK">University of Kelaniya</option>
                    <option value="UoJ">University of Jaffna</option>
                    <option value="USJP">
                        University of Sri Jayewardenepura
                    </option>
                    <option value="UoM">University of Moratuwa</option>

                    <option value="OUSL">
                        The Open University of Sri Lanka
                    </option>
                    <option value="EUSL">
                        Eastern University of Sri Lanka
                    </option>
                    <option value="SUSL">
                        Sabaragamuwa University of Sri Lanka
                    </option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div className="mb-4">
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                    <option value="">Select role (optional)</option>
                    <option value="student">Student</option>
                    <option value="staff">Staff</option>
                    <option value="lecturer">Lecturer</option>
                </select>
            </div>
            <div className="mb-4 flex items-center">
                <input
                    type="checkbox"
                    id="isSchoolStudent"
                    checked={isSchoolStudent}
                    onChange={(e) => setIsSchoolStudent(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="isSchoolStudent">I am a school student</label>
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
