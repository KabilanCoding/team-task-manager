import { Router } from "express";
import { listMembers } from "../controllers/userController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { asyncHandler } from "../utils/errors.js";

const router = Router();

router.get("/", requireAuth, requireAdmin, asyncHandler(listMembers));

export default router;
