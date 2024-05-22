import express, { json } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { RegisterUser, LoginUser } from "../utils/authUtils.js";
import VerifyJwt from "../middlewares/jwt.js";

dotenv.config();

const router = express.Router();

router.use(express.json());

router.get("/login", (req, res) => {
    res.send("login");
});

router.post("/login", async (req, res) => {

    const { email, password } = req.body;

    try {
        const results = await LoginUser({ email, password });

        console.log("results[0]: ", results);

        if (results === "User does not exist") {
            return res.send({ error: "User does not exist" });
        } else if (results === "Invalid password") {
            return res.send({ error: "Invalid password" });
        }

        const id = results[0].id;

        const token = jwt.sign({ id }, process.env.JWT_SECRET, {
            expiresIn: "1h",
        });

        // Remover a senha antes de enviar a resposta
        const { password: _, ...userWithoutPassword } = results[0];

        res.json({
            auth: true,
            token: token,
            user: userWithoutPassword,
            message: "User logged in successfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).send({ error: "An error occurred during login" });
    }
});


router.post("/register", async (req, res) => {

    const { name, email, phone, password } = req.body;

    try {
        const results = await RegisterUser({ name, email, phone, password });
        console.log(results);
        if (results === "User already exists") {
            res.send({ error: "User already exists" });
        } else {

            const token = jwt.sign({ id }, process.env.JWT_SECRET, {
                expiresIn: "1h",
            });

            res.json({
                auth: true,
                token: token,
                user: results,
                message: "User registered successfully",
            });
        }
    } catch (error) {
        console.log(error);
    }
});

router.get("/checkAuth", VerifyJwt, (req, res) => {
    console.log(req.userId);
    res.json({ auth: true, message: "User is authenticated" });
});

router.get("/", (req, res) => {
    res.send("Hello World");
});

export default router;
