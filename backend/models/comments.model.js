import mongoose from "mongoose";


const commentSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    profileId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    },
    postId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    },
    body:{
        type:String,
        required:true,
    }
})
const Comment = mongoose.model("Comment", commentSchema);
export default Comment;