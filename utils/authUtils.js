import bcrypt, { hash } from 'bcrypt';
import client from '../db/pool.js';
import dotenv from 'dotenv';

dotenv.config();

export async function RegisterUser(user) {

    const { name, email, phone, password } = user;

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await client.query("SELECT * FROM users WHERE email = $1 OR phone = $2", [email, phone]);

    if (userExists.rows.length > 0) {
        return 'User already exists';
    }

    try {
        const results = await client.query("INSERT INTO users (name, email, phone, password) VALUES ($1, $2, $3, $4) RETURNING *", [name, email, phone, hashedPassword]);
        console.log('User registered successfully');
        return results.rows;
    } catch (error) {
        console.log(error);
    }
}

export async function LoginUser(user) {

    const { email, password } = user;

    const userExists = await client.query("SELECT * FROM users WHERE email = $1", [email]);

    if (userExists.rows.length === 0) {
        return 'User does not exist';
    }

    const hashedPassword = userExists.rows[0].password;

    console.log("rows:",userExists.rows);

    const match = await bcrypt.compare(password, hashedPassword);

    if (!match) {
        return 'Invalid password';
    }

    return userExists.rows;
}

export default { RegisterUser, LoginUser };
