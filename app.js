import express from 'express';
import client from './db/pool.js';
import userRoutes from './routes/authRoutes.js';
import cors from 'cors';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());


app.use('/api/auth', userRoutes);

app.get('/', async (req, res) => {

    res.send('Hello World');

    try {
        const results = await client.query('SELECT * FROM users');
        console.table(results.rows);
    } catch (error) {
        console.log(error);
    }finally{
        await client.end();
    }

})


app.listen(3000, () => {
    console.log('Server is running on port 3000');
})
