import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

const isLogin = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).send({ success: false, message: "User Unauthorized - No Token" });
        }

        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found" });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(`Error in isLogin: ${error.message}`);
        res.status(500).send({
            success: false,
            message: "Authentication Failed",
            error: error.message
        });
    }
};

export default isLogin;
