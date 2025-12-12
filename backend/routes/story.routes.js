import express from 'express';
import {verifyUser} from "../middleware/authMiddleware.js";
import {checkUserStory, createStory, deleteStory, getFollowingStories} from "../controllers/story.controller.js";
import multer from "multer";
import {storage} from "../cloudConfig.js";
const router = express.Router();

const upload = multer({storage})
router.post("/createStory", verifyUser, upload.single("file"), createStory);
router.route("/getFollowingUserStories").get(verifyUser, getFollowingStories)
router.route("/deleteStory").delete(verifyUser, deleteStory);
router.route("/checkUserStory").get(verifyUser, checkUserStory);

export default router;