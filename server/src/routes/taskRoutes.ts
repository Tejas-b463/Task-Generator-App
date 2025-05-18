import express from "express";
import {
  createTask,
  getTasks,
  deleteTask,
  updateTask,
  generateGeminiTasks
} from "../controllers/taskController";

const router = express.Router();

router.get("/:userId", getTasks);
router.post("/", createTask);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/generate", generateGeminiTasks); // POST /api/tasks/generate

export default router;
