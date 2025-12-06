

//authMiddleware
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.auth = (req,res, next)=>{
    try{
        // console.log("header", req.header("Authorization"));
        const token = req.cookies.token || req.body.token || req.header("Authorization").replace("Bearer ", "");

    if(!token){
        return res.status(401).json({
            success:false,
            message:"Token Missing"
        });
    }
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);

            req.user = decode;
        } catch(error) {
            return res.status(401).json({
                success:false,
                message:"token is invalid",
            });
        }
        next();
    }
    catch(error){
        return res.status(401).json({
            success:false,
            message:"Someting went wrong, while verifying the token",
        });
    }
}

exports.isInvestor = (req,res,next) => {
    try{
        if(req.user.role !== "Investor"){
            return res.status(401).json({
                success:false,
                message:"This is a protected route for investor",
            })
        }
        next();
    }
    catch(error) {
        return res.status(500).json({
            success:false,
            message:"User Role is not matching",
        })
    }
}

exports.isAdmin = (req,res,next) => {
    try{
        if(req.user.role !== "Admin") {
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admin',
            });
        }
        next();
}
catch(error) {
    return res.status(500).json({
        success:false,
        message:'User Role is not matching',
    })
}
}