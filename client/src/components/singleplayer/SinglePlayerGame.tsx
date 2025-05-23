import React, { useMemo, useState, useEffect, useRef } from "react";
import { useParagraph } from "../../helpers/useParagraph";
import BlinkingCursor from "../../utils/BlinkingCursor";
import Results from "./Results";
import { useLoader } from "../../utils/LoaderContext";
import { AlertCircle } from "lucide-react";

const SinglePlayerGame = () => {
    const { paragraph, isLoading } = useParagraph();
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [tracking, setTracking] = useState<string[][]>([]);
    const [timer, setTimer] = useState(30);
    const [isStarted, setIsStarted] = useState(false);
    const focusRef = useRef<HTMLDivElement>(null);
    const { showLoader, hideLoader } = useLoader();
    const [isCapsLockOn, setIsCapsLockOn] = useState(false);
    /* const [liveProgress, setLiveProgress] = useState(0);

    const trackProgress = () => {
        const totalCharacters = paragraph.join(" ").length;
        const typedCharacters = tracking.reduce((count, word) => count + word.length, 0);
        const progress = (typedCharacters / totalCharacters) * 100;
    }; */

    useEffect(() => {
        focusRef.current?.focus();
        if (isLoading) {
            showLoader();
        } else {
            hideLoader();
        }
    }, [isLoading, paragraph, showLoader, hideLoader]);

    useEffect(() => {
        const checkCapsLock = (e: KeyboardEvent) => {
            setIsCapsLockOn(e.getModifierState('CapsLock'));
        };

        window.addEventListener('keydown', checkCapsLock);
        window.addEventListener('keyup', checkCapsLock);

        return () => {
            window.removeEventListener('keydown', checkCapsLock);
            window.removeEventListener('keyup', checkCapsLock);
        };
    }, []);

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
                    {!isLoading && (
                        <>
                            
                            <div className=" test fadein relative rounded-lg shadow-lg transition-all ease-in pb-12 font-mono" >
                                <div className=" absolute top-5 left-8 timer fadein text-3xl text-letter-unchecked">{timer}</div>
                                {isCapsLockOn && (  
                                    <div className="absolute p-2 text-xl top-5 right-[45%] fadein flex items-center bg-yellow-400">
                                        <AlertCircle className="mr-2" color="black"/>
                                        <span className="text-black">Caps Lock is ON</span>
                                    </div>
                                )}
                                <div
                                    ref={focusRef}
                                    className="paragraph mx-auto flex w-full flex-wrap   px-8 pt-16 pb-8  text-4xl leading-relaxed tracking-wide text-[#0061fe]  outline-none hover:cursor-default   h-[350px] overflow-clip"
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
            )}
        </>
    );
};

export default SinglePlayerGame;
