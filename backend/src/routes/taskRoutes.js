import { Router } from "express";
import { body, param } from "express-validator";
import { createTask, dashboard, listTasks, updateTaskStatus } from "../controllers/taskController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/errors.js";

const router = Router();

router.get("/dashboard", requireAuth, asyncHandler(dashboard));
router.get("/", requireAuth, asyncHandler(listTasks));
router.post(
  "/",
  requireAuth,
  requireAdmin,
  [
    body("projectId").isInt().withMessage("projectId is required"),
    body("title").trim().isLength({ min: 2 }).withMessage("Task title is required"),
    body("description").optional({ nullable: true }).isLength({ max: 2000 }),
    body("assignedTo").isInt().withMessage("assignedTo is required"),
    body("status").optional().isIn(["pending", "in-progress", "done"]),
    body("dueDate").isISO8601().withMessage("Valid dueDate is required")
  ],
  validate,
  asyncHandler(createTask)
);
router.patch(
  "/:id/status",
  requireAuth,
  [
    param("id").isInt(),
    body("status").isIn(["pending", "in-progress", "done"]).withMessage("Invalid task status")
  ],
  validate,
  asyncHandler(updateTaskStatus)
);

export default router;
