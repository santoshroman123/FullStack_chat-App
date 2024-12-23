import express from "express";
import protectroute from "../middlewars/protectroute.js";
import {getusersforsidebar,getmessage,sendmessage} from "../controllers/messageController.js"
const router =express.Router();

router.get("/users",protectroute,getusersforsidebar);
router.get("/:id",protectroute,getmessage);
router.post("/send/:id",protectroute,sendmessage)

export default router