import React, { useMemo } from 'react';

interface ResultsProps {
    typed: string[][];
    paragraph: string[];
    time?: number;
}

const Results: React.FC<ResultsProps> = ({ typed, paragraph, time = 30 }) => {
    const results = useMemo(() => {
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

        return { rawWPM, correctWPM, accuracy };
    }, [typed, paragraph, time]);

    return (
        <div className="bg-white shadow-md rounded-lg p-6 max-w-md mx-auto mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Typing Test Results</h2>
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Raw WPM:</span>
                    <span className="text-xl font-semibold text-blue-600">{results.rawWPM}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Correct WPM:</span>
                    <span className="text-xl font-semibold text-green-600">{results.correctWPM}</span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-gray-600">Accuracy:</span>
                    <span className="text-xl font-semibold text-purple-600">{results.accuracy}%</span>
                </div>
            </div>
        </div>
    );
};

export default Results;

