import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Comment from "../models/comments.model.js"
import Profile from "../models/profile.model.js";

export const getComments = async (req, res) => {
  try {
    const { postid } = req.query;
    if (!postid) return res.status(400).send({ message: "Didnot get postId" });
    const comments = await Comment.find({ postId: postid }).select(
      "body userId"
    );
    if (!comments || comments.length === 0)
      return res.status(201).send({ message: "Theres no comment" });
    const userId = comments.map((data) => data.userId);
    const profiles = await Profile.find({ userId }).select(
      "name profilePicture userId"
    );
    if (!profiles) return res.status(400).send("Didnot Fetch Profile");
    let profileMap = new Map();
    profiles.forEach((p) => profileMap.set(p.userId.toString(), p));

    const combined = comments.map((c) => {
      const profile = profileMap.get(c.userId.toString());
      return {
        _id: c._id,
        body: c.body,
        userId: c.userId,
        name: profile.name,
        profilePicture: profile.profilePicture,
      };
    });

    return res.status(200).json({ comments: combined });
  } catch (err) {
    console.log(err);
    return res
      .status(400)
      .send({ message: "Something went wrong at getComments..." });
  }
};


export const createComment = async (req, res)=>{
    try {
        const {post_id, body} = req.body;
        const user = req.user._id;
        if(!post_id || !body){
            return res.status(400).send({message:"Invalid credentials"});
        }
        const post = await Post.findOne({_id: post_id});
        if(!post){
            return res.status(400).send({message:"Post not found"});
        }
        const profile = await Profile.findOne({userId: user});
        if(!profile) return res.status(400).send("Profile Not Found");
        const comment = new Comment({
            postId: post_id,
            body,
            userId:user,
            profileId:profile._id
        });
        await comment.save();
        return res.status(200).json({message:"Comment successfully created"});
    }catch (err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}

export const deleteComment = async (req, res)=>{
    try {
        const { comment_id} = req.body;
        const user = req.user._id;
        if (!comment_id){
            return res.status(400).send({message:"Invalid credentials"});
        }
        const comment = await Comment.findOne({_id:comment_id});
        if(!comment){
            return res.status(400).send({message:"Comment not found"});
        }
        if(comment.userId.toString() !== user.toString()){
            return res.status(400).send({message:"Authentication failed"});
        }
        await Comment.deleteOne({_id:comment_id});
        return res.status(200).send({message:"Comment successfully deleted"});
    }catch(err){
        console.log(err);
        return res.status(400).send({message:"Something went wrong..."});
    }
}
