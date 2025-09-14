import express from "express";
import { registerUser, verifyUser, loginUser, profileUser } from "../controller/user.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/user/register", registerUser);
router.post("/user/verify", verifyUser);
router.post("/user/login", loginUser);

// Protected route
router.get("/user/profile", authMiddleware, profileUser);

export default router;
