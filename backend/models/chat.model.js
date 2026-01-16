import mongoose from "mongoose";


const chatSchema = new mongoose.Schema({
    chatName:{
        type:String,
        trim:true
    },
    isGroupChat:{
        type:Boolean,
        default:false
    },
    users:[{
        type:mongoose.Schema.ObjectId,
        ref:"Profile",
    }],
    latestMessage:{
        type:mongoose.Schema.ObjectId,
        ref:"Message"
    },
    groupAdmin:{
        type:mongoose.Schema.ObjectId,
        ref:"Profile"
    }},
    {timestamps: true}
)

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;