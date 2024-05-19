import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

function VerifyJwt(req, res, next){

    const token = req.headers['access-token'];


    if (!token) {
        console.log("No token provided")
        res.json({ auth: false, error: 'No token provided' });
    } else {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                console.log("Your token has expired")
                res.json({ auth: false, error: 'Your session is expired' });
            } else {
                req.userId = decoded.id

                console.log("User with id " + req.userId + " is authenticated")

                next();
            }
        });
    }
}

export default VerifyJwt;
