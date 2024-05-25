import client from '../db/pool.js';
import dotenv from 'dotenv';

dotenv.config();

export async function UploadPost(post) {

    const { title, content, imageUrl,userId} = post;

    console.log('Post:', post);

    try {
        const result = await client.query(
            "INSERT INTO posts (image_url, title, content, user_id) VALUES ($1, $2, $3, $4) RETURNING *",
            [imageUrl, title, content, userId]
        );

        return result.rows[0];
    } catch (err) {
        console.error('Error inserting post:', err);
        throw new Error('Failed to upload post');
    }
}

