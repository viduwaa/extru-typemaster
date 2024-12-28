import React, { useMemo, useState, useEffect } from "react";
import { useParagraph } from "../../../helpers/useParagraph";
import BlinkingCursor from "./BlinkingCursor";
import Results from "./Results";

const Logic = () => {
    const { paragraph } = useParagraph();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [tracking, setTracking] = useState<string[][]>([]);
    const [timer, setTimer] = useState(30);
    const [isStarted, setIsStarted] = useState(false);

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
                    (prev) => tracking[currentWordIndex - 1]?.length || 0
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

        return () => {
            if (intervalId) clearInterval(intervalId);
        };
    }, [isStarted, timer]);

    return (
        <>
            {timer === 0 ? (
                <>
                    <div className="timer">Game Over</div>
                    <Results typed={tracking} paragraph={paragraph} />
                </>
            ) : (
                <>
                    <div className="timer">{timer}</div>
                    <div className="test relative">
                        <div
                            className="paragraph flex gap-1 flex-wrap text-3xl tracking-wide gap-x-2 gap-y-3 text-gray-400 "
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

export default Logic;
