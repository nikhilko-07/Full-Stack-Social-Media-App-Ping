import Chat from "../models/chat.model.js";
import Profile from "../models/profile.model.js";
import User from "../models/user.model.js";

export const accessChat = async (req, res) => {
  const { profileId } = req.body;

  if (!profileId) {
    return res.status(400).send("UserId not sent with request");
  }
  const ownUserId = req.user._id;
  const ownProfile = await Profile.findOne({userId: ownUserId})

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: ownProfile._id } } },
      { users: { $elemMatch: { $eq: profileId } } },
    ],
  })
    .populate("users", "name profilePicture")
    .populate("latestMessage");

  isChat = await Profile.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePicture",
  });

  if (isChat.length > 0) {
    return res.send(isChat[0]);
  }

  try {
    const createdChat = await Chat.create({
      chatName: "sender",
      isGroupChat: false,
      users: [ownProfile._id, profileId],
    });

    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate("users",);

    res.status(200).json(FullChat);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


export const fetchChats = async (req, res) => {
  try {
    const ownUserId = req.user._id;
    const ownProfile = await Profile.findOne({userId: ownUserId});
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: ownProfile._id }  },
    })
      .populate("users", "name profilePicture _id")
      .populate("groupAdmin", "name profilePicture")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name pic",
    });

    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).send("Something went wrong at fetchChats controller");
  }
};

