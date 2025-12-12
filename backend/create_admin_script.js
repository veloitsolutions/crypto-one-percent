
const mongoose = require('mongoose');
const User = require('./Models/User');
const bcrypt = require('bcrypt');
require('dotenv').config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to MongoDB");

        const email = "admin@crypto.com";
        const password = "admin123";
        const phone = "1234567890";
        const userId = "ADMIN001";
        const name = "Super Admin";

        // Check if exists
        const existingAdmin = await User.findOne({ email });
        if (existingAdmin) {
            console.log("Admin user already exists with email:", email);
            // Update to ensure it is admin and has known password
            const hashedPassword = await bcrypt.hash(password, 10);
            existingAdmin.role = "Admin";
            existingAdmin.password = hashedPassword;
            await existingAdmin.save();
            console.log("Admin credentials updated.");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        } else {
            const hashedPassword = await bcrypt.hash(password, 10);
            await User.create({
                userId,
                name,
                email,
                phone,
                password: hashedPassword,
                role: "Admin",
                tokenBalance: 10000,
                referralCode: userId
            });
            console.log("Admin created successfully.");
            console.log(`Email: ${email}`);
            console.log(`Password: ${password}`);
        }

        process.exit(0);
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
