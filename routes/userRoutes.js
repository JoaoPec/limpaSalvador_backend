import express, { json } from "express"
import VerifyJwt from "../middlewares/jwt.js";

const router = express.Router();

router.use(express.json());

router.post("/post",VerifyJwt, async (req, res) => {

    const { title, content } = req.body;

    try {
        const results = await Post({ title, content });
        console.log(results);
        res.json({ message: "Post created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "An error occurred during post creation" });
    }
});

export default router;
