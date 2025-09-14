import mongoose from "mongoose";
const connectDB = async () =>
    {
        try{
            await mongoose.connect(process.env.DB)// database connect pannura varaikkum w8 panum so use await 
console.log("database connection")
        }  
        catch(error){
            console.log("error")

        };
        
    }// any connection is there meams so only it use async() funvtion dont stop means use

export default connectDB;
