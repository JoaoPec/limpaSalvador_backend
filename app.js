import express from 'express';
import client from './db/pool.js';

const app = express();


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
