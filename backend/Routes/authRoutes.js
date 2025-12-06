

//authRoutes
const express = require("express");
const router = express.Router();

const {login, signup} = require("../Controllers/Auth");
const {auth, isInvestor, isAdmin} = require("../Middlewares/authMiddleware");
const User = require("../Models/User"); // Import the User model

router.post("/login", login);
router.post("/signup",signup);
// router.get("/getUser/:id",getUserById);

// Add the logout route
router.post("/logout", auth, (req, res) => {
  try {
    // Clear the cookie if you're using cookies
    res.clearCookie('token');
    
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error during logout",
      error: error.message
    });
  }
});

router.get("/me", auth, async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password"); // Exclude password
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  });

router.get("/investor", auth, isInvestor, (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Protected route for Investor",
    });
});

router.get("/admin",auth, isAdmin, (req,res)=>{
    res.json({
        success:true,
        message:"Welcome to the Protected route for Admin",
    });
});

module.exports = router;