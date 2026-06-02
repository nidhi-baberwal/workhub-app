import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {

    console.log("HEADERS:", req.headers.authorization);

    console.log("SECRET:", process.env.JWT_SECRET);
   
    const authHeader = req.headers.authorization;

    console.log("AUTH HEADER:", authHeader);

    if(!authHeader){
        return res.status(401).json({message: "No token"});
    }

    const token = authHeader.split(" ")[1];

    try{
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
    } catch(error){
        console.log("JWT ERROR:", error.message);
        res.status(401).json({message: "Invalid token"});
    }
};

export default authMiddleware;