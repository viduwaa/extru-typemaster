import React, { useMemo } from "react";
import { Trophy, Medal, Award } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";

interface PlayerResult {
    playerName: string;
    rawWPM: number;
    correctWPM: number;
    accuracy: number;
}

interface MultiPlayerEndScreenProps {
    gameId: string;
    results: PlayerResult[];
}

const MultiPlayerEndScreen: React.FC<MultiPlayerEndScreenProps> = ({
    gameId,
    results,
}) => {
    const sortedResults = useMemo(() => {
        return [...results].sort((a, b) => {
            if (b.correctWPM !== a.correctWPM) {
                return b.correctWPM - a.correctWPM;
            }
            return b.accuracy - a.accuracy;
        });
    }, [results]);

    const getPositionIcon = (position: number) => {
        switch (position) {
            case 0:
                return <Trophy className="w-6 h-6 text-yellow-400" />;
            case 1:
                return <Medal className="w-6 h-6 text-gray-400" />;
            case 2:
                return <Award className="w-6 h-6 text-amber-600" />;
            default:
                return null;
        }
    };

    return (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg"
        >
            <motion.h2 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-3xl font-bold text-center mb-6 text-indigo-600"
            >
                Game Results
            </motion.h2>
            <motion.p 
                initial={{ y: -10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="text-center mb-8 text-gray-600"
            >
                Game ID:{" "}
                <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                    {gameId}
                </span>
            </motion.p>

            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-indigo-100 text-indigo-600">
                            <th className="px-4 py-2 text-left">Rank</th>
                            <th className="px-4 py-2 text-left">Player</th>
                            <th className="px-4 py-2 text-right">
                                Correct WPM
                            </th>
                            <th className="px-4 py-2 text-right">Raw WPM</th>
                            <th className="px-4 py-2 text-right">Accuracy</th>
                        </tr>
                    </thead>
                    <AnimatePresence>
                        <motion.tbody>
                            {sortedResults.map((result, index) => (
                                <motion.tr
                                    key={result.playerName}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ 
                                        delay: index * 0.1,
                                        duration: 0.5,
                                        ease: "easeInOut"
                                    }}
                                    className={
                                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                                    }
                                >
                                    <td className="px-4 py-3 flex items-center">
                                        {getPositionIcon(index)}
                                        <span className="ml-2 font-semibold">
                                            {index + 1}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 font-medium">
                                        {result.playerName}
                                    </td>
                                    <td className="px-4 py-3 text-right font-semibold text-green-600">
                                        {result.correctWPM}
                                    </td>
                                    <td className="px-4 py-3 text-right text-gray-600">
                                        {result.rawWPM}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <motion.span
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ delay: index * 0.1 + 0.3, duration: 0.3 }}
                                            className={`px-2 py-1 rounded inline-block ${
                                                result.accuracy >= 90
                                                    ? "bg-green-100 text-green-800"
                                                    : result.accuracy >= 70
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                        >
                                            {result.accuracy.toFixed(1)}%
                                        </motion.span>
                                    </td>
                                </motion.tr>
                            ))}
                        </motion.tbody>
                    </AnimatePresence>
                </table>
            </div>
        </motion.div>
    );
};

export default MultiPlayerEndScreen;

