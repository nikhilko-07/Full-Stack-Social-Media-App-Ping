import { Router } from "express";
import {verifyUser} from "../middleware/authMiddleware.js";
import { accessChat, addToGroup, createGroupChat, fetchChats, removeFromGroup, renameGroup } from "../controllers/chat.controller.js";

const router = Router();

router.route("/accessChat").post(verifyUser, accessChat);
router.route("/fetchChat").get(verifyUser, fetchChats);
router.route("/creatGroupChat").post(verifyUser, createGroupChat);
router.route("/renameGroup").put(verifyUser, renameGroup);
router.route("/groupRemove").put(verifyUser, removeFromGroup);
router.route("/groupAdd").put(verifyUser, addToGroup);

export default router;