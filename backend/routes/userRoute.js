import express from "express";
import isLogin from "../middleware/isLogin.js"
import { getcurrentchatter, getUserBySearch } from "../controllers/userSearchController.js";

const router = express.Router();

router.get("/search", isLogin, getUserBySearch);
router.get("/getcurrentchatter", isLogin, getcurrentchatter);

export default router;