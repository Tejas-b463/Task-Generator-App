import { Request, Response } from "express";
import { db } from "../db";
import { tasks } from "../db/schema";
import { eq } from "drizzle-orm";
import { generateTasks } from "../utils/geminiClient";

// Generate tasks from Gemini API
export const generateGeminiTasks = async (req: Request, res: Response): Promise<void> => {
  try {
    const { topic } = req.body;
    const tasks = await generateTasks(topic);
    res.json({ tasks });
  } catch (error) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: "Failed to generate tasks" });
  }
};

// Get all tasks
export const getTasks = async (req: Request, res: Response) => {
  const userId = req.params.userId;
  const result = await db.select().from(tasks).where(eq(tasks.userId, userId));
  res.json(result);
};

// Create new task
export const createTask = async (req: Request, res: Response) => {
  const { title, userId, topic } = req.body;

  const [insertedTask] = await db
    .insert(tasks)
    .values({ title, userId, completed: false, topic })
    .returning(); 

  res.json(insertedTask);
};



// Update task
export const updateTask = async (req: Request, res: Response) => {
  const { title, completed } = req.body;
  const taskId = parseInt(req.params.id);
  const result = await db.update(tasks).set({ title, completed }).where(eq(tasks.id, taskId));
  res.json(result);
};

// Delete task
export const deleteTask = async (req: Request, res: Response) => {
  const taskId = parseInt(req.params.id);
  const result = await db.delete(tasks).where(eq(tasks.id, taskId));
  res.json(result);
};
