import express from 'express';
import client from './db/pool.js';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import cors from 'cors';
import cron from 'node-cron';
import http from 'http';
import VerifyJwt from './middlewares/jwt.js';

const app = express();

// middlewares
app.use(cors());
app.use(express.json());

dotenv.config();

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);

app.get('/',VerifyJwt, async (req, res) => {

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

    // Configurando node-cron para fazer uma requisição a cada 14 minutos
    cron.schedule('*/10 * * * *', () => {
        console.log('Fazendo requisição para manter a API ativa');
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: '/',
            method: 'GET'
        };

        const req = http.request(options, (res) => {
            console.log(`STATUS: ${res.statusCode}`);
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(`BODY: ${chunk}`);
            });
            res.on('end', () => {
                console.log('No more data in response.');
            });
        });

        req.on('error', (e) => {
            console.error(`Problem with request: ${e.message}`);
        });

        req.end();
    });

})
