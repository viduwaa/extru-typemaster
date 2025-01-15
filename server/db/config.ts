import { createPool } from 'mysql2/promise';

const pool = createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'root', // Replace with your MySQL password
  database: 'typing-game',
  port: parseInt(process.env.MYSQL_PORT || '3306'), // Default MySQL port is 3306
  waitForConnections: true,
  connectionLimit: 10, // Adjust as needed
  queueLimit: 0
});

export default pool;
