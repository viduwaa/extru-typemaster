import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    port: parseInt(process.env.POSTGRES_PORT || '5432'),
    database: 'typing-game'
  });

  export default pool;