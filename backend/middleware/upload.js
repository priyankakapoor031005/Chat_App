import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const profileImgPath = path.join(__dirname, "..", "public", "profileimg");

// Ensure the folder exists
if (!fs.existsSync(profileImgPath)) {
    fs.mkdirSync(profileImgPath, { recursive: true });
}

// Multer config
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, profileImgPath);
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e4)}-${file.originalname}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

export const uploadImage = upload.single("profilePic");

