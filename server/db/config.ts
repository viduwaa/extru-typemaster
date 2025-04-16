import { createPool } from "mysql2/promise";
require('dotenv').config();

const pool = createPool({
    host: "localhost",
    user: "process.env.DB_USER", 
    password: "process.env.DB_PW", 
    database: "process.env.DB_NAME",
    port: parseInt(process.env.MYSQL_PORT || "3306"), 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export default pool;
