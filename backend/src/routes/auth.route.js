import express from "express";
import { signup,login,logout, isOnboarding } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);

router.post("/login",login);

router.post("/logout",logout);

router.post("/onboard",protectRoute,isOnboarding);

export default router;