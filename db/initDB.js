import client from "./pool.js";

async function createTables() {

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


        await client.query(`
            CREATE TABLE IF NOT EXISTS posts (
                id SERIAL PRIMARY KEY,
                image_url TEXT NOT NULL,
                title TEXT NOT NULL,
                content TEXT NOT NULL,
                user_id INTEGER NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
            )
        `);

        console.log("Tables created successfully");
    } catch (error) {
        console.error("Error creating tables:", error);
    }finally {
        client.end();
    }
}

createTables();

