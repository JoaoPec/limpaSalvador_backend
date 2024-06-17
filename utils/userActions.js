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

export async function UploadComment(comment) {

    const { content, postId, userId } = comment;

    if (!content) {
        throw new Error('Comment content is required');
    }

    console.log(postId)

    try {
        const result = await client.query(
            `INSERT INTO comments (content, post_id, user_id) VALUES ($1, $2, $3) RETURNING *`,
            [content, postId, userId]
        );

        console.log('Comment uploaded successfully:', result.rows[0]);

        return result.rows[0];

    } catch (err) {
        console.error('Error inserting comment:', err);
        throw new Error('Failed to upload comment');
    }

}



export async function GetPosts() {

    try {
        const result = await client.query(`
            SELECT
                posts.*,
                users.name AS user_name,
                comments.id AS comment_id,
                comments.content AS comment_content,
                comments.created_at AS comment_created_at,
                comment_users.name AS comment_user_name
            FROM
                posts
            JOIN
                users ON posts.user_id = users.id
            LEFT JOIN
                comments ON posts.id = comments.post_id
            LEFT JOIN
                users AS comment_users ON comments.user_id = comment_users.id
        `);

        console.log("Sending posts...");

        // Formatar os resultados para agrupar os comentários por post
        const posts = result.rows.reduce((acc, row) => {
            const {
                id,
                image_url,
                title,
                content,
                bairro,
                user_id,
                created_at,
                user_name,
                comment_id,
                comment_content,
                comment_created_at,
                comment_user_name
            } = row;

            // Verificar se o post já existe no array
            const existingPost = acc.find(post => post.id === id);

            // Se o post já existir, adicionar o comentário a ele
            if (existingPost) {
                if (comment_id) {
                    existingPost.comments.push({
                        id: comment_id,
                        content: comment_content,
                        created_at: comment_created_at,
                        user_name: comment_user_name
                    });
                }
            } else { // Se o post não existir, criar um novo post e adicionar o comentário a ele
                const newPost = {
                    id,
                    image_url,
                    title,
                    content,
                    bairro,
                    user_id,
                    created_at,
                    user_name,
                    comments: []
                };
                if (comment_id) {
                    newPost.comments.push({
                        id: comment_id,
                        content: comment_content,
                        created_at: comment_created_at,
                        user_name: comment_user_name
                    });
                }
                acc.push(newPost);
            }

            return acc;
        }, []);

        console.log("Posts sent:", posts);

        return posts;
    } catch (err) {
        console.error('Error getting posts:', err);
        throw new Error('Failed to get posts');
    }
}

export async function DeletePost(postId) {

    console.log(postId);

    try {
        const result = await client.query(`
                DELETE FROM posts WHERE id = $1
            `, [postId]);

        console.log('Post deleted successfully:', result.rowCount);

        return result.rowCount;
    } catch (err) {
        console.error('Error deleting post:', err);
        throw new Error('Failed to delete post');
    }
}

export async function GetUserProfile(userId) {

    try {
        // Get user details
        const userResult = await client.query(`
            SELECT id, name, email FROM users WHERE id = $1
        `, [userId]);

        if (userResult.rows.length === 0) {
            throw new Error('User not found');
        }

        const user = userResult.rows[0];

        // Get user's posts
        const postsResult = await client.query(`
            SELECT posts.*, users.name AS user_name
            FROM posts
            JOIN users ON posts.user_id = users.id
            WHERE users.id = $1
        `, [userId]);

        const posts = postsResult.rows;

        // Get user's comments
        const commentsResult = await client.query(`
            SELECT comments.*, posts.title AS post_title, post_users.name AS post_user_name
            FROM comments
            JOIN posts ON comments.post_id = posts.id
            JOIN users AS post_users ON posts.user_id = post_users.id
            WHERE comments.user_id = $1
        `, [userId]);

        const comments = commentsResult.rows;

        return {
            user,
            posts,
            comments
        };
    } catch (err) {
        console.error('Error getting user profile:', err);
        throw new Error('Failed to get user profile');
    }
}
