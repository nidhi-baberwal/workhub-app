import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";

//Register
export const register = async(req, res) => {
  
   console.log("REGISTER BODY:", req.body);

  try{
    const{ name, email, password } = req.body;

     const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
        name,
        email,
        password: hashedPassword,
    }); 
    res.status(201).json(user);

  }catch(err){
    console.log(" FULL ERROR:", err);
  console.log(" ERROR NAME:", err.name);
  console.log(" ERROR CODE:", err.code);
    res.status(500).json({message: err.message})
  }
}

// Login
export const login = async(req, res) =>{
    console.log(req.body);

    try{
    const {email, password} = req.body;

    const user = await User.findOne({email});
    if(!user){
        return res.status(400).json({message: "user not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        return res.status(400).json({message: "Invalid credentials"});
    }

    console.log("ENV CHECK:", process.env.JWT_SECRET);
    console.log("USER ID:", user._id);
    console.log("TOKEN:", generateToken(user._id));
 
    const token = generateToken(user._id);
    console.log("Generated token:", token);

    const { password: userPassword, ...safeUser } = user._doc; // remove password before sending

    res.status(200).json({
        message: "Login successfull",
        token,
        user: safeUser});

}catch(err){
    res.status(500).json({message: err.message});
}
}