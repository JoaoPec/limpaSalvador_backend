import client from "./pool.js";


async function createTable() {

    try {
    await client.query(`
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255),
            phone VARCHAR(255),
            email VARCHAR(255),
            password VARCHAR(255)
        )
    `);
    console.log("Table created successfully");
  } catch (error) {
    console.log(error);
  } finally {
    await client.end();
  }
}

createTable();
