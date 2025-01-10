import { useMemo, useState } from 'react';


interface ResultsProps {
    currentPlayer : { id: string; name: string };
    typed: string[][];
    paragraph: string[];
    gameTime: number;
}

export const useMultiplayerResult  = ({ currentPlayer, typed, paragraph, gameTime }: ResultsProps) => {

    const [results, setResults] = useState({
        id: '',
        playerName : '',
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
        const minutes = gameTime / 60; 
        const rawWPM = Math.round(typedWords/minutes);
        const correctWPM = Math.round(correctWords/ minutes);
        const accuracy = Math.round((correctWords / typedWords) * 100)

        setResults({ id: currentPlayer.id, playerName: currentPlayer.name, rawWPM, correctWPM, accuracy });
        return { rawWPM, correctWPM, accuracy };
    }, [typed, paragraph, gameTime]);

    return {results };
};


