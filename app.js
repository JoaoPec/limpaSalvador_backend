import express from 'express';
import client from './db/pool.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/', async (req, res) => {

    try {
        const results = await client.query('SELECT * FROM users');
        console.log(results.rows);
        res.json(results.rows);
    } catch (error) {
        console.log(error);
    }
})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
