import express from "express"
import { getMessages, sendMessage } from "../controllers/messageController.js";
import isLogin from "../middleware/isLogin.js";

const router = express.Router();

router.post("/send/:id", isLogin, sendMessage);

router.get("/chat/:id", isLogin, getMessages);

export default router;