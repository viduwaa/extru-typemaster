import React, { useState } from "react";
import Logic from "./controllers/Logic";
import MultiplayerGame from "../MultiplayerGame";

const Game = () => {
    const [gameMode, setGameMode] = useState<'single' | 'multi' | null>(null);

    return (
        <>
            <h1>Typing Game</h1>
            {!gameMode && (
                <div>
                    <button onClick={() => setGameMode('single')}>Single Player</button>
                    <button onClick={() => setGameMode('multi')}>Multiplayer</button>
                </div>
            )}
            {gameMode === 'single' && <Logic />}
            {gameMode === 'multi' && <MultiplayerGame />}
        </>
    );
};

export default Game;

