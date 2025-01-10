import { Pool } from 'pg';
import format from 'pg-format';
import { Game } from '../types';

interface Player {
  id: string;
  name: string;
  avatar: string;
}

interface GameResult {
  id: string;
  playerName: string;
  rawWPM: number;
  correctWPM: number;
  accuracy: number;
}



export const insertGameResults = async (pool: Pool, game: Game) => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Prepare players data for bulk insert
    const playersValues = game.players.map(player => [
      player.id,                                    // unique_id
      player.name,                                  // name
      player.avatar,                                // avatar
      player?.university || '',  // university
      player?.role || '',        // role
      player?.isSchoolStudent || false, // school_student
      new Date()                                    // created_at
    ]);

    // Bulk insert players with ON CONFLICT DO UPDATE
    const playerQuery = format(
      `INSERT INTO mp_players (
        unique_id, name, avatar, university, role, school_student, created_at
      ) VALUES %L 
      ON CONFLICT (unique_id) 
      DO UPDATE SET 
        name = EXCLUDED.name,
        avatar = EXCLUDED.avatar,
        university = EXCLUDED.university,
        role = EXCLUDED.role,
        school_student = EXCLUDED.school_student`,
      playersValues
    );

    await client.query(playerQuery);
    console.log('Players inserted successfully');

    // Prepare leaderboard data for bulk insert
    const leaderboardValues = game.results.map(result => [
      result.id,           // player_id
      result.correctWPM,   // wpm
      result.accuracy,     // accuracy
      new Date()           // created_at
    ]);

    // Bulk insert leaderboard entries
    const leaderboardQuery = format(
      `INSERT INTO mp_leaderboard (
        player_id, wpm, accuracy, created_at
      ) VALUES %L`,
      leaderboardValues
    );

    await client.query(leaderboardQuery);
    await client.query('COMMIT');
    console.log('Game results inserted successfully');

    return true;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error inserting game results:', error);
    throw error;
  } finally {
    client.release();
  }
};

// Function to get top players from leaderboard
export const getTopPlayers = async (pool: Pool, limit: number = 10) => {
  const query = `
    SELECT 
      mp.unique_id,
      mp.name,
      mp.avatar,
      mp.university,
      mp.role,
      ml.wpm,
      ml.accuracy,
      ml.created_at
    FROM mp_leaderboard ml
    JOIN mp_players mp ON ml.player_id = mp.unique_id
    ORDER BY ml.wpm DESC, ml.accuracy DESC
    LIMIT $1
  `;

  const result = await pool.query(query, [limit]);
  return result.rows;
};

