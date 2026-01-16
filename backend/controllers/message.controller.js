import Message from "../models/message.model.js";
import Chat from "../models/chat.model.js";
import Profile from "../models/profile.model.js";

export const allMessages = async(req, res) =>{
    try{
        const message = await Message.find({chat: req.query.chatId})
        .populate("sender", "name")
        .populate("chat");
        
        return res.status(200).json(message);
        
    }catch(err){
        console.log(err);
        return res.status(500).send("Something went wrong at allMessages controller");
    }
}

export const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      return res.status(400).send("Fill all required fields");
    }
    const userId = req.user._id;
    const profile = await Profile.findOne({userId})

    if(!profile){
      return res.status(404).send("Unauthorized");
    }

    let message = await Message.create({
      sender: profile._id,
      content,
      chat: chatId,
    });

    // ✅ NEW WAY (NO execPopulate)
    message = await message.populate("sender", "name");
    message = await message.populate("chat");
    message = await message.populate({
      path: "chat.users",
      select: "name profilePicture",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    return res.status(200).json(message);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Something went wrong at send Message Controller");
  }
};