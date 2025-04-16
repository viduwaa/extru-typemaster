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
        const typedCharacters = typed.flat();
        const expectedCharacters = paragraph.join('').split(''); 

        
        // Count total characters typed and correct characters
        const totalTyped = typedCharacters.length;
        let correctCharacters = 0;

        typedCharacters.forEach((char, index) => {
            if (char === expectedCharacters[index]) {
                correctCharacters++;
            }
        });

        // Calculate WPM and accuracy
        const minutes = gameTime / 60;
        const rawWPM = Math.round(totalTyped / 5 / minutes); // Raw WPM based on typed characters
        const correctWPM = Math.round(correctCharacters / 5 / minutes); // Correct WPM based on correct characters
        const accuracy = totalTyped > 0 ? Math.round((correctCharacters / totalTyped) * 100) : 0;

        console.log(correctCharacters)
        console.log(totalTyped)


        setResults({ id: currentPlayer.id, playerName: currentPlayer.name, rawWPM, correctWPM, accuracy });
        return { rawWPM, correctWPM, accuracy };
    }, [typed, paragraph, gameTime]);

    return {results };
};


