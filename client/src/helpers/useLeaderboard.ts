import axios from 'axios'
import { useState, useEffect } from 'react'
import { io } from 'socket.io-client'

export interface LeaderboardPlayer {
  unique_id: string
  name: string
  avatar: string
  university: string
  role: string
  wpm: number
  accuracy: number
  created_at: string
}

const socket = io("https://type.malkoha.site:3011", {
    withCredentials: true,
    transports: ["websocket", "polling"],
});

export const useLeaderboard = () => {
  const [players, setPlayers] = useState<LeaderboardPlayer[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    

    setLoading(true);
    axios
      .get("http://localhost:3011/api/leaderboard")
      .then((res) => {
        setPlayers(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard");
        setLoading(false);
      });

    socket.on("leaderboardUpdate", (updatedLeaderboard) => {
      setPlayers(updatedLeaderboard);
    });

    return () => {
      socket.disconnect()
    }
  }, [])

  return { players, loading, error }
}

