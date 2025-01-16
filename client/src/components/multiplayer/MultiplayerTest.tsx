import React, { useMemo, useState, useEffect, useRef } from "react";
import BlinkingCursor from "../../utils/BlinkingCursor";
import { Socket } from "socket.io-client";
import { useMultiplayerResult } from "../../helpers/useMultiplayerResult";
import MultiPlayerEndScreen from "./MultiPlayerEndScreen";
import LiveProgress from "./LiveProgress";
import { AlertCircle } from "lucide-react";
import { useLoader } from "../../utils/LoaderContext";
import { useParagraph } from "../../helpers/useParagraph";
import { gameTime } from "../../controllers/gameSettings";

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
    currentPlayer,
}) => {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [tracking, setTracking] = useState<string[][]>([]);
    const { isLoading } = useParagraph();
    const [timer, setTimer] = useState(gameTime);
    const [isStarted, setIsStarted] = useState(false);
    const [endGame, setEndGame] = useState(false);
    const [finalResults, setFinalResults] = useState<ResultsProps[]>([]);
    const [allProgress, setAllProgress] = useState<
        { id: string; player: string; progress: number }[]
    >([]);
    const focusRef = useRef<HTMLDivElement>(null);
    const { showLoader, hideLoader } = useLoader();
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);

    const trackProgress = () => {
        const totalCharacters = paragraph.join(" ").length;
        const typedCharacters = tracking.reduce(
            (count, word) => count + word.length,
            0,
        );
        const progress = (typedCharacters / totalCharacters) * 100;
        socket.emit("updateProgress", { gameId, currentPlayer, progress });
    };

    useEffect(() => {
        focusRef.current?.focus();
        if (isLoading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isLoading, paragraph, showLoader, hideLoader]);
    console.log(paragraph)

    useEffect(() => {
        const checkCapsLock = (e: KeyboardEvent) => {
            setIsCapsLockOn(e.getModifierState("CapsLock"));
        };

        window.addEventListener("keydown", checkCapsLock);
        window.addEventListener("keyup", checkCapsLock);

        return () => {
            window.removeEventListener("keydown", checkCapsLock);
            window.removeEventListener("keyup", checkCapsLock);
        };
    }, []);

    const { results } = useMultiplayerResult({
        currentPlayer: currentPlayer || { id: "", name: "" },
        typed: tracking,
        paragraph,
        gameTime: gameTime,
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

        socket.on(
            "progressUpdated",
            (
                allProgress: { id: string; player: string; progress: number }[],
            ) => {
                setAllProgress(allProgress);
            },
        );

        return () => {
            socket.off("gameResults");
            socket.off("progressUpdated");
        };
    }, [socket, endGame]);

    const correctOrIncorrect = (wordIndex: number, letterIndex: number) => {
        if (tracking[wordIndex] === undefined) return "text-letter-unchecked";
        if (tracking[wordIndex][letterIndex] === undefined)
            return "text-letter-unchecked";
        if (
            paragraph[wordIndex][letterIndex] ===
            tracking[wordIndex][letterIndex]
        )
            return "text-letter-correct";
        return "text-letter-incorrect";
    };

    const extraIncorrect = (wordIndex: number): JSX.Element[] | undefined => {
        const currentWord = tracking[wordIndex];
        const expectedLength = paragraph[wordIndex]?.length;

        if (!currentWord || !expectedLength) return;

        const extraLetters = currentWord.slice(expectedLength);

        return extraLetters.map((letter, index) => (
            <span key={index} className="text-letter-incorrect">
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
            return "underline decoration-letter-incorrect";
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

        /* const isCorrectKey =
                e.key === paragraph[currentWordIndex][currentLetterIndex]; */
        const isSpaceKey = e.key === " ";
        const isBackspace = e.key === "Backspace";

        if (isBackspace) {
            // Don't go back if at start of first word
            if (currentLetterIndex === 0 && currentWordIndex === 0) return;

            // Handle backspace at start of word
            if (currentLetterIndex === 0 && currentWordIndex > 0) {
                setCurrentWordIndex(currentWordIndex - 1);
                setCurrentLetterIndex(
                    () => tracking[currentWordIndex - 1]?.length || 0,
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
        focusRef.current?.focus();

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
                    <LiveProgress
                        players={players}
                        allProgress={allProgress}
                        currentPlayer={currentPlayer}
                    />

                    <div className="test test fadein relative rounded-lg pb-12 font-mono shadow-lg transition-all ease-in">
                        <div className="timer fadein absolute left-8 top-5 text-3xl text-letter-unchecked">
                            {timer}
                        </div>
                        {isCapsLockOn && (
                            <div className="fadein absolute right-[45%] top-5 flex items-center bg-yellow-400 p-2 text-xl">
                                <AlertCircle className="mr-2" color="black" />
                                <span className="text-black">
                                    Caps Lock is ON
                                </span>
                            </div>
                        )}
                        <div
                            ref={focusRef}
                            className="paragraph mx-auto flex h-[350px] w-full flex-wrap overflow-clip px-8 pb-8 pt-16 text-4xl leading-relaxed tracking-wide text-[#0061fe] outline-none hover:cursor-default"
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
