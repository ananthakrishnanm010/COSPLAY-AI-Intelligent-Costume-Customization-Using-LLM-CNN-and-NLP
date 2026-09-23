require("dotenv").config();

const { Client } = require("pg");

const client = new Client({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    await client.connect();

    const result = await client.query("SELECT NOW()");

    console.log("PostgreSQL connected successfully!");
    console.log("Database time:", result.rows[0].now);
  } catch (error) {
    console.error("PostgreSQL connection failed:");
    console.error(error.message);
  } finally {
    await client.end();
  }
}

testConnection();
