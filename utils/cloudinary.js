import cloudinary from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';

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
