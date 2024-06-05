import express, { json } from "express"
import VerifyJwt from "../middlewares/jwt.js";
import { UploadImage } from "../utils/cloudinary.js";
import { UploadPost, GetPosts, UplaodComment } from "../utils/userActions.js";
import multer from "multer";
import fs from "fs";

const upload = multer({ dest: 'uploads/' }); // Multer will save files in the "uploads" directory

const router = express.Router();

router.use(express.json());

router.post('/post', VerifyJwt, upload.single('image'), async (req, res) => {

    const { title, content, bairro } = req.body;
    const { file } = req;


    console.log("id: ", req.userId)

    if (!file) {
        return res.status(400).json({ error: 'Image is required' });
    }

    try {

        const imageUrl = await UploadImage(file.path);

        UploadPost({ title, content, imageUrl, userId: req.userId, bairro});

        res.status(201).json({ success: true, message: 'Post created successfully', imageUrl });

    } catch (error) {
        res.status(500).json({ error: `Failed to upload post` });
    } finally {
        // Remova o arquivo local após o upload
        if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
        }
    }
});

router.post('/comment', VerifyJwt, async (req, res) => {

    const { content, postId } = req.body;

    try {
        UplaodComment({ content, postId, userId: req.userId });
        res.status(201).json({ success: true, message: 'Comment created successfully' });
    } catch (error) {
        res.status(500).json({ error: `Failed to upload comment` });
    }
});

router.get('/posts', async (req, res) => {

    try {
        const posts = await GetPosts();
        res.json(posts);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get posts' });
    }
})

export default router;
