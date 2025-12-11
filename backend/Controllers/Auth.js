

// Controllers/authController.js
const bcrypt = require("bcrypt");
const User = require("../Models/User");
const jwt = require("jsonwebtoken");
const ReferralReward = require("../Models/ReferralReward"); // Add this
require("dotenv").config();

// Helper function to generate unique UserId
const generateUserId = async () => {
    while (true) {
        // Generate a random 8-character string
        const userId = 'USR' + Math.random().toString(36).substr(2, 8).toUpperCase();

        // Check if this userId already exists
        const existingUser = await User.findOne({ userId });
        if (!existingUser) {
            return userId;
        }
    }
};

// Modify the signup controller to handle referral codes
// Controllers/authController.js - Update the signup function
exports.signup = async (req, res) => {
    try {
        const { name, email, phone, password, role, referralCode } = req.body;

        // Validate required fields
        if (!name || !email || !phone || !password) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields",
            });
        }

        // Check for existing user by email
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "Email already registered. Please use a different email or login.",
            });
        }

        // Check for existing phone number
        const existingPhone = await User.findOne({ phone });
        if (existingPhone) {
            return res.status(400).json({
                success: false,
                message: "Phone number already registered. Please use a different number.",
            });
        }

        // Generate unique UserId
        const userId = await generateUserId();

        // Hash password
        let hashedPassword;
        try {
            hashedPassword = await bcrypt.hash(password, 10);
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "Error in hashing password",
            });
        }

        // Check referral code if provided
        let referredBy = null;
        if (referralCode) {
            const referrer = await User.findOne({ userId: referralCode });
            if (!referrer) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid referral code. Please check and try again.",
                });
            }
            referredBy = referralCode;

            // Create pending referral reward
            const referralReward = await ReferralReward.create({
                referrer: referralCode,
                referee: userId,
                amount: 50,
                status: 'pending'
            });

            // Add to referrer's pending rewards
            await User.findOneAndUpdate(
                { userId: referralCode },
                { $push: { pendingReferralRewards: referralReward._id } }
            );
        }

        // Create user with UserId and referral info
        const user = await User.create({
            userId,
            name,
            email,
            phone,
            password: hashedPassword,
            role,
            referralCode: userId,  // Use userId as referral code
            referredBy
        });

        return res.status(200).json({
            success: true,
            message: "Account created successfully! Redirecting to login...",
            userId: user.userId
        });
    } catch (error) {
        console.error('Signup error:', error);

        // Handle MongoDB duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            let message = "This information is already registered.";

            if (field === 'email') {
                message = "Email already registered. Please use a different email or login.";
            } else if (field === 'phone') {
                message = "Phone number already registered. Please use a different number.";
            } else if (field === 'userId') {
                message = "User ID conflict. Please try again.";
            }

            return res.status(400).json({
                success: false,
                message: message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Unable to create account. Please try again later.",
        });
    }
}



exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Please fill all the details carefully",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User is not registered",
            });
        }

        const payload = {
            email: user.email,
            id: user._id,
            userId: user.userId, // Include userId in JWT payload
            phone: user.phone,
            role: user.role,
        };

        if (await bcrypt.compare(password, user.password)) {
            let token = jwt.sign(payload,
                process.env.JWT_SECRET,
                {
                    expiresIn: "2h",
                });

            const userResponse = user.toObject();
            delete userResponse.password;
            userResponse.token = token;

            const options = {
                expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
                httpOnly: true,
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                token,
                user: userResponse,
                message: "User Logged in successfully",
            });
        } else {
            return res.status(403).json({
                success: false,
                message: "Password is Incorrect",
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Login Failure",
        });
    }
}

