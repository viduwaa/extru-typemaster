import mysql from 'mysql2/promise';
import { Game } from '../types';

interface Player {
  id: string;
  name: string;
  avatar: string;
  university?: string;
  role?: string;
  isSchoolStudent?: boolean;
}

interface GameResult {
  id: string;
  playerName: string;
  rawWPM: number;
  correctWPM: number;
  accuracy: number;
}

export const insertGameResults = async (pool: mysql.Pool, game: Game) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // Prepare players data for bulk insert
    const playersValues = game.players.map(player => [
      player.id,
      player.name,
      player.avatar,
      player.university || '',
      player.role || '',
      player.isSchoolStudent || false,
      new Date()
    ]);

    // Bulk insert players with ON DUPLICATE KEY UPDATE
    const playerQuery = `
      INSERT INTO mp_playersPublic (
        unique_id, name, avatar, university, role, school_student, created_at
      ) VALUES ? 
      ON DUPLICATE KEY UPDATE 
        name = VALUES(name),
        avatar = VALUES(avatar),
        university = VALUES(university),
        role = VALUES(role),
        school_student = VALUES(school_student)
    `;

    await connection.query(playerQuery, [playersValues]);
    console.log('Players inserted successfully');

    // Prepare leaderboard data for bulk insert
    const leaderboardValues = game.results.map(result => [
      result.id,
      result.correctWPM,
      result.accuracy,
      new Date()
    ]);

    // Bulk insert leaderboard entries
    const leaderboardQuery = `
      INSERT INTO mp_leaderboardPublic (
        player_id, wpm, accuracy, created_at
      ) VALUES ?
    `;

    await connection.query(leaderboardQuery, [leaderboardValues]);
    await connection.commit();
    console.log('Game results inserted successfully');

    return true;
  } catch (error) {
    await connection.rollback();
    console.error('Error inserting game results:', error);
    throw error;
  } finally {
    connection.release();
  }
};

// Function to get top players from leaderboard
export const getTopPlayers = async (pool: mysql.Pool, limit: number = 10) => {
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
    LIMIT ?
  `;

  const [rows] = await pool.query(query, [limit]);
  return rows;
};


export const getPublicTopPlayers = async (pool: mysql.Pool, limit: number = 10) => {
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
    FROM mp_leaderboardPublic ml
    JOIN mp_playersPublic mp ON ml.player_id = mp.unique_id
    ORDER BY ml.wpm DESC, ml.accuracy DESC
    LIMIT ?
  `;

  const [rows] = await pool.query(query, [limit]);
  return rows;
};
  
  export const getTotalPlayers = async (pool: mysql.Pool): Promise<number> => {
  const query = `
    SELECT COUNT(*) as totalPlayers FROM mp_players
  `;

  const [rows] = await pool.query<mysql.RowDataPacket[]>(query);
  const totalPlayers = rows[0].totalPlayers as number;

  return totalPlayers;
};

export const getPublicTotalPlayers = async (pool: mysql.Pool): Promise<number> => {
  const query = `
    SELECT COUNT(*) as totalPlayers FROM mp_playersPublic
  `;

  const [rows] = await pool.query<mysql.RowDataPacket[]>(query);
  const totalPlayers = rows[0].totalPlayers as number;

  return totalPlayers;
};



