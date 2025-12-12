import mongoose from "mongoose";


const storySchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    profileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profile"
    },
    imageUrl:{
        path:{
            type:String,
            required:true,
        },
        filename:{
            type:String,
            required:true,
        }
    },
    createdAt:{
        type:Date,
        default:Date.now,
        expires: 60 * 60 * 24
    },
})
const Story = mongoose.model("Story",storySchema);
export default Story;