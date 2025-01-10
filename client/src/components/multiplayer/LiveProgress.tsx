import React, { useMemo } from 'react'
import Car1 from '../../assets/cars/car-1.webp'
import Car2 from '../../assets/cars/car-2.webp'
import Car3 from '../../assets/cars/car-3.webp'
import Car4 from '../../assets/cars/car-4.webp'
import Endline from '../../assets/cars/endline.webp'

interface PlayerRaceTrackProps {
    players: {
        id: string;
        name: string;
        avatar: string;
    }[];
    allProgress: { id: string; player: string; progress: number }[]; 
    currentPlayer: { id: string; name: string } | null;
}

const cars = [Car1, Car2, Car3, Car4];

const LiveProgress: React.FC<PlayerRaceTrackProps> = ({ players, allProgress, currentPlayer }) => {
    return (
        <div className='racetrack flex flex-col gap-4 -mt-5 w-3/4 m-auto'>
            {players.map((player, index) => {
                const playerProgress = useMemo(() => allProgress.find(p => p.id === player.id)?.progress || 0, [allProgress, player.id]);
                return (
                    <div key={player.id} className={`relative h-10 bg-gray-200 rounded-full overflow-hidden ${currentPlayer?.id === player.id ? 'border-2 border-blue-500' : ''}`}>
                        <div className='absolute top-0 left-[16%] h-full w-[76%] flex items-center'>
                            <div className='w-full border-b-2 border-dotted border-gray-400'></div>
                        </div>
                        <div 
                            className='absolute top-0 h-full transition-all duration-300 ease-out flex items-center left-[15%]'
                            style={{ left: `${playerProgress+16}%` }}
                        >
                            <img src={cars[index % cars.length]} alt={`${player.name}'s car`} className='w-20 h-auto' />
                        </div>
                        <div className='absolute top-0 left-5 w-36 overflow-hidden whitespace-nowrap h-full flex items-center gap-1'>
                            <img src={player.avatar} alt={player.name} className='h-8 w-8 rounded-full mr-2' />
                            <span className='font-semibold'>{player.name}</span>
                        </div>
                        <div className='absolute top-0 right-[5%] h-full flex items-center'>
                            <img src={Endline} alt="Race Endline" className='w-9' />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default LiveProgress;
