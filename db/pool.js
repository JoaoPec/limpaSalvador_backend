import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv'

dotenv.config()

//Local database

//const client = new Pool({
//    user: process.env.DB_USER,
//    host: process.env.DB_HOST,
//    database: "limpasalvador",
//    password: process.env.DB_PASS,
//    port: process.env.DB_PORT
//})

// Render database

const client = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    }
})


export default client
