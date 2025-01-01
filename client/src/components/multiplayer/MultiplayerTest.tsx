    import React, { useMemo, useState, useEffect } from "react";
    import BlinkingCursor from "../../utils/BlinkingCursor";
    import { Socket } from "socket.io-client";
    import { useMultiplayerResult } from "../../helpers/useMultiplayerResult";
    import MultiPlayerEndScreen from "./MultiPlayerEndScreen";
    import LiveProgress from "./LiveProgress";

    interface MultiplayerLogicProps {
        gameId: string;
        players: {
            id: string;
            name: string;
            avatar: string;
        }[];
        paragraph: string[];
        socket: Socket;
        playerName: string;
        currentPlayer: { id: string; name: string } | null;
    }

    type ResultsProps = {
        playerName: string;
        rawWPM: number;
        correctWPM: number;
        accuracy: number;
    };

    const MultiplayerTest: React.FC<MultiplayerLogicProps> = ({
        gameId,
        players,
        paragraph,
        socket,
        playerName,
        currentPlayer
    }) => {
        const [currentWordIndex, setCurrentWordIndex] = useState(0);
        const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
        const [tracking, setTracking] = useState<string[][]>([]);
        const [timer, setTimer] = useState(30);
        const [isStarted, setIsStarted] = useState(false);
        const [endGame, setEndGame] = useState(false);
        const [finalResults, setFinalResults] = useState<ResultsProps[]>([]);
        const [allProgress, setAllProgress] = useState<{player:string,progress:number}[]>([]);

        const trackProgress = () => {
            const totalCharacters = paragraph.join(" ").length;
            const typedCharacters = tracking.reduce((count, word) => count + word.length, 0);
            const progress = (typedCharacters / totalCharacters) * 100;
            socket.emit("updateProgress", { gameId, playerName, progress });
        };
    
        const { results } = useMultiplayerResult({
            playerName,
            typed: tracking,
            paragraph,
            time: 30,
        });
    
        const gameEnded = () => {
            if (timer === 0) {
                socket.emit("gameEnded", { gameId, results });
                setEndGame(true);
            }
        };
    
        useEffect(() => {
            if (endGame) {
                socket.on("gameResults", (results: ResultsProps[]) => {
                    setFinalResults(results);
                    console.log("Received results:", results);
                });
            }
    
            socket.on("progressUpdated", (allProgress: {player:string,progress:number}[]) => {
                setAllProgress(allProgress);
            });
    
            return () => {
                socket.off("gameResults");
                socket.off("progressUpdated");
            };
        }, [socket, endGame]);

        const correctOrIncorrect = (wordIndex: number, letterIndex: number) => {
            if (tracking[wordIndex] === undefined) return "text-gray-400";
            if (tracking[wordIndex][letterIndex] === undefined)
                return "text-gray-400";
            if (
                paragraph[wordIndex][letterIndex] ===
                tracking[wordIndex][letterIndex]
            )
                return "text-green-500";
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
            // Only check words that user has moved past
            if (wordIndex >= currentWordIndex) return "";

            // Check if word exists and lengths don't match
            if (tracking[wordIndex] === undefined) return "";
            if (
                tracking[wordIndex].length !== paragraph[wordIndex].length ||
                paragraph[wordIndex] !== tracking[wordIndex].join("")
            ) {
                return "underline decoration-red-500";
            }
            return "";
        };

        const renderParagraph = useMemo(() => {
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
            const isValidKey =
                /^[a-zA-Z0-9 .,;!?'"@#$%&()-]$/.test(e.key) ||
                e.key === "Backspace" ||
                e.key === " ";
            if (!isValidKey) return;

            const isCorrectKey =
                e.key === paragraph[currentWordIndex][currentLetterIndex];
            const isSpaceKey = e.key === " ";
            const isBackspace = e.key === "Backspace";


            if (isBackspace) {
                // Don't go back if at start of first word
                if (currentLetterIndex === 0 && currentWordIndex === 0) return;

                // Handle backspace at start of word
                if (currentLetterIndex === 0 && currentWordIndex > 0) {
                    setCurrentWordIndex(currentWordIndex - 1);
                    setCurrentLetterIndex(
                        (prev) => tracking[currentWordIndex - 1]?.length || 0,
                    );
                    setTracking((prev) => prev.slice(0, -1));
                    return;
                }

                // Normal backspace within word
                setCurrentLetterIndex(currentLetterIndex - 1);
                setTracking((prev) => {
                    const newArray = [...prev];
                    newArray[newArray.length - 1] = newArray[
                        newArray.length - 1
                    ].slice(0, -1);
                    return newArray;
                });
                return;
            }

            // Original input handling
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

            trackProgress();
            //console.log(tracking);
        };

        const getCurrentWordLength = () => {
            return tracking[currentWordIndex]?.length || 0;
        };

        useEffect(() => {
            let intervalId: NodeJS.Timeout;

            if (isStarted && timer > 0) {
                intervalId = setInterval(() => {
                    setTimer((prev) => prev - 1);
                }, 1000);
            }

            if (timer === 0) {
                gameEnded();
            }

            return () => {
                if (intervalId) clearInterval(intervalId);
            };
        }, [isStarted, timer]);

        return (
            <>
                {timer === 0 ? (
                    <>
                        <div className="timer">Game Over</div>
                        <MultiPlayerEndScreen
                            gameId={gameId}
                            results={finalResults}
                        />
                    </>
                ) : (
                    <>
                        <LiveProgress players={players} allProgress={allProgress} playerName ={playerName} currentPlayer={currentPlayer} />
                        <div className="timer">{timer}</div>
                        <div className="test relative">
                            <div
                                className="paragraph flex flex-wrap gap-1 gap-x-2 gap-y-3 text-3xl tracking-wide text-gray-400"
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
            </>
        );
    };

    export default MultiplayerTest;
