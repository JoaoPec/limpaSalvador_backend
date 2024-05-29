import express from 'express';
import client from './db/pool.js';
import cloudinary from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
    timeout: 100000
});

const cloudinaryOptions = {
    folder: "limpaSalvador",
    format: 'jpg',
    quality: 'auto',
    fetch_format: 'auto',
    secure: true
};

export async function UploadImage(filePath) {

    console.log('File path:', filePath);

    try {

        const res = await cloudinary.v2.uploader.upload(filePath, cloudinaryOptions);

        console.log('Image uploaded successfully:');

        return res.secure_url;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error(error.message);
    }
}
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
