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
      .populate("users", "name profilePicture")
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

export const createGroupChat = async (req, res) => {
  try {
    if (!req.body.users || !req.body.name) {
      return res.status(400).send("Please fill all the fields");
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res.status(400).send("At least 3 users required");
    }
    const ownId = req.user._id;
    const ownProfile = await Profile.findOne({userId: ownId});
    users.push(ownProfile._id);

    const groupChat = await Chat.create({
      chatName: req.body.name,
      users,
      isGroupChat: true,
      groupAdmin: ownProfile._id,
    });

    const fullGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to create group chat");
  }
};

export const renameGroup = async (req, res) => {
  try {
    const { chatId, chatName } = req.body;
    const updateChat = await Chat.findByIdAndUpdate(
      chatId,
      { chatName: chatName },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!updateChat) {
      return res.status(400).send("Chat Not Found");
    } else {
      return res.json(updateChat);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to rename Group");
  }
};

export const removeFromGroup = async (req, res) => {
  try {
    const { chatId, profileId } = req.body;

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: profileId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!removed) {
      return res.status(404).send("Chat Not Found");
    } else {
      return res.json(removed);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to remove user");
  }
};

export const addToGroup = async (req, res) => {
  try {
    const { chatId, profileId } = req.body;
    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: profileId },
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");
    if (!added) {
      return res.status(404).send("Chat not found");
    } else {
      return res.json(added);
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send("Failed to add User");
  }
};
