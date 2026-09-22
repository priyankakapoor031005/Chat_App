import express from "express"
import { userLogin, userLogout, userRegister } from "../controllers/userController.js";
import { uploadImage } from "../middleware/upload.js";



const router = express.Router();

router.post("/register", uploadImage, userRegister)

router.post("/login", userLogin);

router.post("/logout", userLogout);


export default router; 