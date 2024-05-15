import express, { json } from "express";
import registerUser from "../utils/authUtils.js";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import verifyJwt from "../middlewares/jwt.js";

dotenv.config();

const router = express.Router();

router.use(express.json());

router.get("/login", (req, res) => {
    res.send("Login");
})

router.post("/register", async (req, res) => {

    const { name, email, phone, password } = req.body;

    try {
        const results = await registerUser({ name, email, phone, password });
        console.log(results);
        if (results === 'User already exists') {
            res.send({ error: 'User already exists' });
        } else {

            const id = results[0].id;

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: '1h'
            });

            res.json({ auth: true, token: token, id, data: results, message: 'User registered successfully' });

        }
    } catch (error) {
        console.log(error);
    }
})

router.get("/checkAuth", verifyJwt, (req, res) => {
    console.log(req.userId);
    res.json({ auth: true, message: 'User is authenticated' });
})

router.get("/", (req, res) => {
    res.send("Hello World");
})

export default router;
