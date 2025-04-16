import axios from 'axios';
import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';

export interface LeaderboardPlayer {
  unique_id: string;
  name: string;
  avatar: string;
  university: string;
  role: string;
  wpm: number;
  accuracy: number;
  created_at: string;
}

const socket = io(import.meta.env.VITE_SERVER_URI, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
});

export const useLeaderboard = () => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
  const [averageWPM, setAvgWpm] = useState<number | null>(null);
  const [totalPlayers, setTotalPlayers] = useState<number | null>(null); // New state for total players
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);

    // Fetch leaderboard, average WPM, and total players in parallel
    Promise.all([
      axios.get(import.meta.env.VITE_SERVER_URI + '/api/leaderboard-public'),
      axios.get(import.meta.env.VITE_SERVER_URI + '/api/averagewpm-public'),
      axios.get(import.meta.env.VITE_SERVER_URI + '/api/totalplayers-public'), // Fetch total players
    ])
      .then(([leaderboardResponse, averageWPMResponse, totalPlayersResponse]) => {
        setPlayers(leaderboardResponse.data);
        setAvgWpm(averageWPMResponse.data);
        setTotalPlayers(totalPlayersResponse.data.totalPlayers); // Set total players
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setError('Failed to load data'); // Set a general error message
      })
      .finally(() => setLoading(false));

    // Listen for leaderboard updates from the server
    socket.on('leaderboardUpdate', (updatedLeaderboard) => {
      setPlayers(updatedLeaderboard);
    });

    // Listen for average WPM updates from the server
    socket.on('averageWPM', (wpm: number) => {
      console.log('Average WPM:', wpm);
      setAvgWpm(wpm);
    });

    // Listen for total players updates from the server
    socket.on('totalPlayersUpdate', (total: number) => {
      console.log('Total Players:', total);
      setTotalPlayers(total);
    });

    // Cleanup function to disconnect the socket
    return () => {
      socket.disconnect();
    };
  }, []);

  return { players, averageWPM, totalPlayers, loading, error };
};