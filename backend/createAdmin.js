const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./Models/User");
require("dotenv").config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");

        const adminEmail = "admin@example.com";
        const adminPassword = "password123";

        const existingAdmin = await User.findOne({ email: adminEmail });
        if (existingAdmin) {
            console.log("Admin already exists.");
            console.log("Email:", adminEmail);
            // We'll verify the password by updating it to ensure we know it
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            // Ensure role is Admin
            existingAdmin.role = "Admin";
            await existingAdmin.save();
            console.log("Admin password reset to:", adminPassword);
        } else {
            const hashedPassword = await bcrypt.hash(adminPassword, 10);
            await User.create({
                userId: "ADMIN01",
                name: "Super Admin",
                email: adminEmail,
                phone: "9999999999",
                password: hashedPassword,
                role: "Admin",
                tokenBalance: 1000,
                referralCode: "ADMIN01"
            });
            console.log("Admin created successfully!");
            console.log("Email:", adminEmail);
            console.log("Password:", adminPassword);
        }
        process.exit();
    } catch (error) {
        console.error("Error creating admin:", error);
        process.exit(1);
    }
};

createAdmin();
