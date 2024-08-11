const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME, 
  port: process.env.DB_PORT || 3306, 
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

async function connect() {
  try {
    const connection = await pool.getConnection();

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);
    
    // Use the database
    await connection.query(`USE ${process.env.DB_NAME}`);
    
    // Create the table if it doesn't exist
    await connection.query(`
      CREATE TABLE IF NOT EXISTS banner (
        id INT AUTO_INCREMENT PRIMARY KEY,
        isVisible BOOLEAN DEFAULT FALSE,
        description TEXT,
        timer INT,
        link VARCHAR(255)
      )
    `);

    // Optional: Insert a default row if the table is empty
    // await connection.query(`
    //   INSERT INTO banner (isVisible, description, timer, link)
    //   SELECT false, '', 0, ''
    //   WHERE NOT EXISTS (SELECT 1 FROM banner)
    // `);

    console.log('Connected to the database and ensured database setup');

    connection.release(); // Release the connection back to the pool

  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
}

module.exports = {
  connect,
  pool
};
