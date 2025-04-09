import mongoose from 'mongoose';


export const connectToDB = async(req,res)=>{
    try{
        const connect = await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Error connecting to MongoDB" });   
    }
}