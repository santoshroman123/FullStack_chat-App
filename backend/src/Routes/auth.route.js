import express from "express";
const router = express.Router();
import {signup,login,logout,updateprofile,checkauth} from "../controllers/authcontroller.js";
import protectroute from "../middlewars/protectroute.js";


router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.put("/update",protectroute,updateprofile);
router.get("/check",protectroute,checkauth);

export default router;