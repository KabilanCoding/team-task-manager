import { Router } from "express";
import { body, param } from "express-validator";
import {
  assignMembers,
  createProject,
  getProject,
  listProjects
} from "../controllers/projectController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/errors.js";

const router = Router();

router.get("/", requireAuth, asyncHandler(listProjects));
router.post(
  "/",
  requireAuth,
  requireAdmin,
  [
    body("name").trim().isLength({ min: 2 }).withMessage("Project name is required"),
    body("description").optional({ nullable: true }).isLength({ max: 1000 }),
    body("memberIds").optional().isArray().withMessage("memberIds must be an array")
  ],
  validate,
  asyncHandler(createProject)
);
router.get("/:id", requireAuth, param("id").isInt(), validate, asyncHandler(getProject));
router.post(
  "/:id/members",
  requireAuth,
  requireAdmin,
  [
    param("id").isInt(),
    body("memberIds").isArray({ min: 1 }).withMessage("At least one member is required")
  ],
  validate,
  asyncHandler(assignMembers)
);

export default router;
