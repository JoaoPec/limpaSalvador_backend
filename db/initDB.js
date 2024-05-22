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

async function createPostsTable() {
    try {
        await client.query(`
            CREATE TABLE posts (
             id SERIAL PRIMARY KEY,
             image_url TEXT NOT NULL,
             content TEXT NOT NULL,
             user_id INTEGER NOT NULL,
             created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
             FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
                `);

        console.log("Posts table created successfully");
    } catch (error) {
        console.log(error);
    } finally {
        await client.end();
    }
}

createTable();
