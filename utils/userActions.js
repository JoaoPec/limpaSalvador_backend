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

export async function UplaodComment(comment) {

    const { content, postId, userId } = comment;

    if (!content) {
        throw new Error('Comment content is required');
    }

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

