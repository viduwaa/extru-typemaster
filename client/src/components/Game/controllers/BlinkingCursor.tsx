import React, { useEffect, useRef, useState } from "react";
import '../styles/BlinkingCursor.css'

interface CursorProps {
    wordIndex: number;
    letterIndex: number;
    text: string;
    currentWordLength: number;
}

const BlinkingCursor: React.FC<CursorProps> = ({
    wordIndex,
    letterIndex,
    text,
    currentWordLength,
}) => {
    const cursorRef = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ left: 0, top: 0 });

    useEffect(() => {
        const updatePosition = () => {
            const words = text.split(" ");
            const currentWord = words[wordIndex];
            const wordElement = document.querySelectorAll(".word")[
                wordIndex
            ] as HTMLElement;

            if (wordElement && cursorRef.current) {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");
                if (context) {
                    const computedStyle = window.getComputedStyle(wordElement);
                    context.font = `${computedStyle.fontWeight} ${computedStyle.fontSize} ${computedStyle.fontFamily}`;

                    const actualLetterIndex = Math.min(
                        letterIndex,
                        currentWordLength
                    );
                    const precedingText = currentWord.substring(
                        0,
                        actualLetterIndex
                    );
                    const textWidth = context.measureText(precedingText).width;

                    let left = wordElement.offsetLeft + textWidth;
                    const top = wordElement.offsetTop;

                    // If we're beyond the end of the expected word, measure the extra letters
                    if (currentWordLength > currentWord.length) {
                        const extraLetters =
                            wordElement.querySelectorAll("span.text-red-500");
                        const extraWidth = Array.from(extraLetters).reduce(
                            (width, span) => {
                                return (
                                    width + span.getBoundingClientRect().width
                                );
                            },
                            0
                        );
                        left += extraWidth;
                    }

                    setPosition({ left, top });
                }
            }
        };

        updatePosition();
        window.addEventListener("resize", updatePosition);

        return () => window.removeEventListener("resize", updatePosition);
    }, [wordIndex, letterIndex, text, currentWordLength]);

    return (
        <div
            ref={cursorRef}
            className="typing-cursor"
            style={{
                position: "absolute",
                left: `${position.left}px`,
                top: `${position.top}px`,
                width: "2px",
                height: "36px",
                backgroundColor: "currentColor",
                animation: "blink 0.9s infinite",
            }}
            aria-hidden="true"
        />
    );
};

export default BlinkingCursor;
