import { Router } from "express";
import {verifyUser} from "../middleware/authMiddleware.js";
import { accessChat, fetchChats } from "../controllers/chat.controller.js";

const router = Router();

router.route("/accessChat").post(verifyUser, accessChat);
router.route("/fetchChat").get(verifyUser, fetchChats);

export default router;