import { Router } from "express";
import { verifyUser } from "../middleware/authMiddleware.js";
import { allMessages, sendMessage } from "../controllers/message.controller.js";

const router = Router();

router.route("/chatId").get(verifyUser, allMessages);
router.route("/sendMessage").post(verifyUser, sendMessage);

export default router;