import User from "../Model/userModel.js";
import bcryptjs from "bcryptjs"
import jwtToken from "../utills/jwtToken.js";

export const userRegister = async (req, res) => {
    try {
        const { fullname, username, email, gender, password } = req.body;

        // Check if username OR email already exists (use $or)
        const user = await User.findOne({
            $or: [{ username }, { email }]
        });

        if (user) {
            return res.status(400).send({ success: false, message: "Username or email already exists." });
        }

        // Hash password
        const hashpassword = bcryptjs.hashSync(password, 10);

        // Set profilePic from file if uploaded
        let profilePic = "";
        if (req.file?.filename) {
            profilePic = req.file.filename;
        }

        // Create new user
        const newUser = new User({
            fullname,
            username,
            email,
            password: hashpassword,
            gender,
            profilePic
        });

        await newUser.save();
        jwtToken(newUser._id, res); // Assumes this sets a cookie/token

        // Respond with user data
        res.status(201).send({
            success: true,
            _id: newUser._id,
            fullname: newUser.fullname,
            username: newUser.username,
            email: newUser.email,
            profilePic: newUser.profilePic
        });

    } catch (error) {
        console.error("Register Error:", error);
        res.status(500).send({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};



export const userLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(500).send({ success: false, message: "Email Doesn't Exist" });
        const comparePass = bcryptjs.compareSync(password, user.password || "");
        if (!comparePass) return res.status(500).send({ success: false, message: "Email or Password doesn't Matching" });

        jwtToken(user._id, res);

        res.status(200).send({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic,
            email: user.email,
            message: "Succesfully Login"
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(error);
    }
}

export const userLogout = async (req, res) => {
    try {
        res.cookie("jwt", "", {
            maxAge: 0
        })

        res.status(200).send({ massage: "User Logout succesfully" })
    } catch (error) {
        res.status(500).send({
            success: false,
            massage: error
        })
        console.log(error);

    }
}