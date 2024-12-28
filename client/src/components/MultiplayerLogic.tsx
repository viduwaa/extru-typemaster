import React, { useState, useEffect } from 'react';
import { Socket } from 'socket.io-client';
import BlinkingCursor from './Game/controllers/BlinkingCursor';
import Results from './Game/controllers/Results';

interface MultiplayerLogicProps {
  gameId: string;
  players: string[];
  paragraph: string[];
  socket: Socket;
}

const MultiplayerLogic: React.FC<MultiplayerLogicProps> = ({ gameId, players, paragraph, socket }) => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [tracking, setTracking] = useState<string[][]>([]);
  const [timer, setTimer] = useState(60);
  const [isStarted, setIsStarted] = useState(false);
  const [playerProgress, setPlayerProgress] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    socket.on('progressUpdated', (progress: { [key: string]: number }) => {
      setPlayerProgress(progress);
    });

    if (isStarted && timer > 0) {
      const intervalId = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }

    return () => {
      socket.off('progressUpdated');
    };
  }, [socket, isStarted, timer]);


  const correctOrIncorrect = (wordIndex: number, letterIndex: number) => {
    if (tracking[wordIndex] === undefined) return "text-gray-400";
    if (tracking[wordIndex][letterIndex] === undefined) return "text-gray-400";
    if (paragraph[wordIndex][letterIndex] === tracking[wordIndex][letterIndex]) return "text-green-500";
    return "text-red-500";
  };

  const extraIncorrect = (wordIndex: number): JSX.Element[] | undefined => {
    const currentWord = tracking[wordIndex];
    const expectedLength = paragraph[wordIndex]?.length;

    if (!currentWord || !expectedLength) return;

    const extraLetters = currentWord.slice(expectedLength);

    return extraLetters.map((letter, index) => (
      <span key={index} className="text-red-500">
        {letter}
      </span>
    ));
  };

  const inCompletedWord = (wordIndex: number) => {
    if (wordIndex >= currentWordIndex) return "";
    if (tracking[wordIndex] === undefined) return "";
    if (
      tracking[wordIndex].length !== paragraph[wordIndex].length ||
      paragraph[wordIndex] !== tracking[wordIndex].join("")
    ) {
      return "underline decoration-red-500";
    }
    return "";
  };

  const renderParagraph = React.useMemo(() => {
    return paragraph.map((word, wordIndex) => (
      <div
        key={wordIndex}
        className={`word ${inCompletedWord(wordIndex)}`}
      >
        {word.split("").map((letter, letterIndex) => (
          <span
            key={letterIndex}
            className={correctOrIncorrect(wordIndex, letterIndex)}
          >
            {letter}
          </span>
        ))}
        {extraIncorrect(wordIndex)}
      </div>
    ));
  }, [paragraph, tracking]);

  const handleInput = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isStarted) setIsStarted(true);
    const isValidKey = /^[a-zA-Z0-9 .,;!?'"@#$%&()-]$/.test(e.key) || e.key === "Backspace" || e.key === " ";
    if (!isValidKey) return;

    const isCorrectKey = e.key === paragraph[currentWordIndex][currentLetterIndex];
    const isSpaceKey = e.key === " ";
    const isBackspace = e.key === "Backspace";

    if (isBackspace) {
      // Handle backspace logic (same as before)
    } else {
      setTracking((prev) => {
        if (isSpaceKey) return [...prev, []];
        return prev.length === 0
          ? [[e.key]]
          : [...prev.slice(0, -1), [...prev[prev.length - 1], e.key]];
      });

      if (isSpaceKey) {
        setCurrentWordIndex(currentWordIndex + 1);
        setCurrentLetterIndex(0);
      } else {
        setCurrentLetterIndex(currentLetterIndex + 1);
      }
    }

    // Update player progress
    const progress = (currentWordIndex / paragraph.length) * 100;
    socket.emit('updateProgress', { gameId, playerName: localStorage.getItem('playerName'), progress });
  };

  const getCurrentWordLength = () => {
    return tracking[currentWordIndex]?.length || 0;
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {timer === 0 ? (
        <>
          <div className="text-2xl font-bold mb-4">Game Over</div>
          <Results typed={tracking} paragraph={paragraph} />
          <div className="mt-4">
            <h3 className="text-xl font-semibold mb-2">Final Results:</h3>
            {Object.entries(playerProgress).map(([player, progress]) => (
              <div key={player} className="flex justify-between items-center mb-2">
                <span>{player}:</span>
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">{progress.toFixed(2)}%</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="text-2xl font-bold mb-4">Time Remaining: {timer}s</div>
          <div className="mb-4">
            <h3 className="text-xl font-semibold mb-2">Player Progress:</h3>
            {Object.entries(playerProgress).map(([player, progress]) => (
              <div key={player} className="flex justify-between items-center mb-2">
                <span>{player}:</span>
                <div className="w-64 bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="test relative">
            <div
              className="paragraph flex flex-wrap text-3xl tracking-wide gap-x-2 gap-y-3 text-gray-400"
              tabIndex={0}
              onKeyDown={handleInput}
            >
              {renderParagraph}
            </div>
            <BlinkingCursor
              wordIndex={currentWordIndex}
              letterIndex={currentLetterIndex}
              text={paragraph.join(" ")}
              currentWordLength={getCurrentWordLength()}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default MultiplayerLogic;

