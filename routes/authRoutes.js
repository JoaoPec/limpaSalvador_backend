import express from "express";
import registerUser from "../utils/authUtils.js";

const router = express.Router();

router.use(express.json());

router.get("/login", (req, res) => {
    res.send("Login");
})

router.post("/register", async (req, res) => {

    const { name, email, phone, password} = req.body;

    try {
        const results = await registerUser({name, email, phone, password});
        console.log(results);
        res.json(results);
    } catch (error) {
        console.log(error);
    }
})

router.get("/", (req, res) => {
    res.send("Hello World");
})

export default router;
