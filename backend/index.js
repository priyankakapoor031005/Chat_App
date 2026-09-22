import express from "express";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import dbConnect from "./DB/dbconfig.js";
import authRoute from "./routes/authUser.js";
import messageRouter from "./routes/messageRout.js";
import userRouter from "./routes/userRoute.js";
import cookieParser from "cookie-parser";

import { app, server } from "./SocketIO/socket.js";

import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Resolve directory paths for static files
// const __dirname = path.resolve();
path.join(__dirname, "..", "frontend", "dist")


dotenv.config();

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS Configuration
app.use(cors({
    origin: "http://localhost:5173",  // Frontend dev server
    credentials: true                // Allow cookies
}));

// API Routes
app.use("/api/auth", authRoute);
app.use("/api/message", messageRouter);
app.use("/api/user", userRouter);

// Parse form data
app.use(express.urlencoded({ extended: false }));

app.use('/profileimg', express.static(path.join(__dirname, "..", 'backend', 'public', 'profileimg')));
console.log(__dirname);


// Serve static frontend files
app.use(express.static(path.join(__dirname, "..", "frontend", "dist")));

// Serve index.html for root route
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname,
        "..", "frontend", "dist", "index.html"));
});


// Start the server
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    dbConnect();
    console.log(`✅ Server running on port ${PORT}`);
});
