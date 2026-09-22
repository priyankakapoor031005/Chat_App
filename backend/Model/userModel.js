import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    fullname: {
        type: String,
        require: true
    },
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    gender: {
        type: String,
        require: true,
        enum: ["male", "female"]
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    profilePic: {
        type: String,
        require: true,
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

export default User;