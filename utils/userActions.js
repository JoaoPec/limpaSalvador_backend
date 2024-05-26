import client from '../db/pool.js';
import dotenv from 'dotenv';

dotenv.config();

export async function UploadPost(post) {

    const { title, content, imageUrl, userId, bairro } = post;

    console.log('Post:', post);

    try {
        const result = await client.query(
            `INSERT INTO posts (image_url, title, content, user_id, bairro) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [imageUrl, title, content, userId, bairro]
        );

        console.log('Post uploaded successfully:', result.rows[0]);

        return result.rows[0];
    } catch (err) {
        console.error('Error inserting post:', err);
        throw new Error('Failed to upload post');
    }
}

export async function GetPosts() {
    try {
        const result = await client.query(`
            SELECT posts.*, users.name AS user_name
            FROM posts
            JOIN users ON posts.user_id = users.id
        `);

        console.log("Sending posts...");

        return result.rows;
    } catch (err) {
        console.error('Error getting posts:', err);
        throw new Error('Failed to get posts');
    }
}