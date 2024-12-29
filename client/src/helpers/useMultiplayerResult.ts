import { useMemo, useState } from 'react';

interface ResultsProps {
    playerName: string;
    typed: string[][];
    paragraph: string[];
    time?: number;
}

export const useMultiplayerResult  = ({ playerName, typed, paragraph, time = 30 }: ResultsProps) => {

    const [results, setResults] = useState({ 
        playerName : playerName,
        rawWPM: 0, 
        correctWPM: 0, 
        accuracy: 0 
    });

    useMemo(() => {
        let typedWords = typed.length;
        let correctWords = 0;

        typed.forEach((typedWord, wordIndex) => {
            const expectedWord = paragraph[wordIndex] || '';
            if(typedWord.join('') === expectedWord){
                correctWords++;
            }
        });

        //console.log(typedWords, correctWords , paragraph , typed);
        const minutes = time / 60; 
        const rawWPM = Math.round(typedWords/minutes);
        const correctWPM = Math.round(correctWords/ minutes);
        const accuracy = Math.round((correctWords / typedWords) * 100)

        setResults({ playerName ,rawWPM, correctWPM, accuracy });

        return { rawWPM, correctWPM, accuracy };
    }, [typed, paragraph, time]);

    return {results };
};


