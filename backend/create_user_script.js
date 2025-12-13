
const mongoose = require('mongoose');
const User = require('./Models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const createUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB for user creation");

        const email = "user@crypto.com";
        const password = "user123";
        const phone = "0987654321";
        const userId = "USER001";
        const name = "Regular User";

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            console.log("User already exists:", email);
            // Update just in case
            const hashedPassword = await bcrypt.hash(password, 10);
            existingUser.password = hashedPassword;
            existingUser.role = "Investor"; // Ensure role is Investor
            await existingUser.save();
            console.log("User password/role updated.");
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                userId,
                name,
                email,
                phone,
                password: hashedPassword,
                role: "Investor",
                tokenBalance: 100,
                referralCode: userId
            });
            console.log("User created successfully.");
        }
        console.log(`User Email: ${email}`);
        console.log(`User Password: ${password}`);

        process.exit(0);
    } catch (error) {
        console.error("Error creating user:", error);
        process.exit(1);
    }
};

createUser();
