import React from 'react'

interface PlayerRaceTrackProps {
    players: {
        id: string;
        name: string;
        avatar: string;
    }[];
    paragraph: string[];
    currentProgress: {
        [key: string]: {
            characterCount: number;
            wpm: number;
        };
    };
}

const LiveProgress: React.FC<PlayerRaceTrackProps> = ({ players, paragraph, currentProgress} ) => {
  return (
    <div className='racetrack'>
        <div>
            <img src="" alt="" />
            <span></span>
            <img src="" alt="" />
        </div>
    </div>
  )
}

export default LiveProgress