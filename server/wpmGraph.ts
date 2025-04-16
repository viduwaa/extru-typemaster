import type { Server } from "socket.io";
import { Pool, RowDataPacket } from 'mysql2/promise'; 


const calculateAverageWPM = async (pool: Pool): Promise<number | null> => {
    try {
      const [rows] = await pool.query<RowDataPacket[] & { average_wpm: number }[]>("SELECT AVG(wpm) as average_wpm FROM mp_leaderboard");
  
      if (rows.length > 0 && rows[0].average_wpm !== null) {
        return parseFloat(rows[0].average_wpm.toString()); 
      } else {
        console.warn("No data returned or unexpected result format:", rows);
        return null;
      }
    } catch (error) {
      console.error("Error calculating average WPM:", error);
      return null;
    }
  };

  

export const setupWPMGraph = (io: Server, pool: Pool) => {
    const emitAverageWPM = async () => {
      const averageWPM = await calculateAverageWPM(pool);
      if (averageWPM !== null) {
        console.log(averageWPM)
        io.emit("averageWPM", averageWPM);
      }
    };
  
    emitAverageWPM();
  };
