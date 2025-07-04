import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const route = express.Router();

route.get("/user", protectRoute, getUsersForSidebar)
route.get("/:id", protectRoute, getMessages)

route.post("/send/:id", protectRoute, sendMessage)

export default route;