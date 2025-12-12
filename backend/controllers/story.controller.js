import Story from "../models/story.model.js";
import Profile from "../models/profile.model.js";

export const createStory = async (req, res) => {
    try {
        const user = req.user._id;
        const profile = await Profile.findOne({ userId: user });

        if (!req.file || req.file.length === 0) {
            return res.status(400).json({ message: "No file Uploaded" });
        }

        const story = new Story({
            userId: user,
            imageUrl: {
                path: req.file.path,
                filename: req.file.filename
            },
            profileId: profile._id
        });
        await story.save();
        return res.status(201).json({ message: "Story created successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

export const getFollowingStories = async (req, res) => {
    try {
        const user = req.user._id;
        const profile = await Profile.findOne({ userId: user });
        if (!profile) {
            return res.status(404).json({ message: "Profile Not Found" });
        }

        // ✅ Include YOUR profile + following profiles
        const allProfileIds = [
            profile._id,  // Your own profile
            ...profile.following.map(u => u._id)  // Following profiles
        ];

        const stories = await Story.find({
            profileId: { $in: allProfileIds }  // All profiles (you + following)
        })
            .populate({
                path: 'profileId',
                select: 'name profilePicture',
            }).select("-imageUrl -userId")

        const uniqueStories = [...new Set(stories.map(story =>story.profileId._id))].map(profileId => stories.find(story => story.profileId._id === profileId));

        return res.status(200).json(uniqueStories);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};


export const deleteStory = async (req, res) => {
    try {
        const user = req.user;
        const { storyId } = req.body; // Fixed: destructure properly

        if (!storyId) {
            return res.status(404).json({ message: "Story ID not provided" });
        }

        // Fixed: await findById and proper variable name
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: "Story not found" });
        }

        // Fixed: proper user ID comparison
        if (story.userId.toString() !== user._id.toString()) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        // Delete file from filesystem
        if (story.imageUrl.path && fs.existsSync(story.imageUrl.path)) {
            fs.unlinkSync(story.imageUrl.path);
        }

        await Story.deleteOne({ _id: storyId });
        return res.status(200).json({ message: "Story deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};

export const checkUserStory = async (req, res) => {
    try {
        const user = req.user;
        const { profile_id } = req.query;
        console.log(profile_id);
        const stories = await Story.find({ profileId:profile_id })
            .populate({
                path: 'profileId',
                select: 'name profilePicture',
                populate: {
                    path: 'userId',
                    select: 'name'
                }
            })
            .select('imageUrl createdAt')
            .sort({ createdAt: -1 })
            .lean();

        if (!stories || stories.length === 0) {
            return res.status(404).json({ message: "No stories found" });
        }

        return res.status(200).json(stories); // Fixed: stories array
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Something went wrong" });
    }
};
