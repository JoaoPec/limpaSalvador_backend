import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv'

dotenv.config()

const client = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT
})

export default client
