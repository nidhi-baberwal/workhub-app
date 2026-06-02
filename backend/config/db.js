import mongoose from "mongoose";

const connectDB = async() => {
  try{
    console.log(" Connecting to MongoDB...");
    
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

  }catch(error){
    console.log("DB connection failed", error);
    process.exit(1); //server stops running 1 means error
  }
}
export default connectDB;