import jwt from "jsonwebtoken";

import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
            try{
                console.log("Incoming cookies (authMiddleware):", req.cookies); // 🧪 DEBUG
                const token = req.cookies.jwt; 

                if(!token){
                     
                    return res.status(401).json({massage: "unauthorized - No Token Provided"})
                }

                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                if(!decoded){
                    return res.status(401).json({massage: "unauthorized - Invalid Token"})
                }

                const user = await User.findById(decoded.userId).select("-password");
                if(!user){
                    return res.status(404).json({massage: "Use is not found"})
                }

                req.user = user

                next()

            }catch(error){
                console.log("error in protectRoutes middleware", error.massage);
                //500 used for server error
                res.status(500).json({massage: "Intenal server error"})
            }
}
