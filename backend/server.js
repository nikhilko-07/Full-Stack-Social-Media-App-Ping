import express from 'express';
const app = express();
import mongoose from "mongoose";

app.use(express.json());
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
    res.send("Hello World!");
})

const db = async ()=>{
    try {
        await mongoose.connect("mongodb+srv://nikhil:nikhil@ourdb.dykydkn.mongodb.net/?retryWrites=true&w=majority&appName=ourDB");
        console.log("Database Connected");
    }catch (err){
        console.log(err);
    }
}

app.listen(PORT, () => {
    db();
    console.log(`Server started on port ${PORT}`);
})