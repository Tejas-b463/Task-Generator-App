"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.createTask = exports.getTasks = exports.generateGeminiTasks = void 0;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const geminiClient_1 = require("../utils/geminiClient");
// Generate tasks from Gemini API
const generateGeminiTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic } = req.body;
        const tasks = yield (0, geminiClient_1.generateTasks)(topic);
        res.json({ tasks });
    }
    catch (error) {
        console.error("Gemini Error:", error);
        res.status(500).json({ error: "Failed to generate tasks" });
    }
});
exports.generateGeminiTasks = generateGeminiTasks;
// Get all tasks
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    const result = yield db_1.db.select().from(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.userId, userId));
    res.json(result);
});
exports.getTasks = getTasks;
// Create new task
const createTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, userId, topic } = req.body;
    const [insertedTask] = yield db_1.db
        .insert(schema_1.tasks)
        .values({ title, userId, completed: false, topic })
        .returning();
    res.json(insertedTask);
});
exports.createTask = createTask;
// Update task
const updateTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, completed } = req.body;
    const taskId = parseInt(req.params.id);
    const result = yield db_1.db.update(schema_1.tasks).set({ title, completed }).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
    res.json(result);
});
exports.updateTask = updateTask;
// Delete task
const deleteTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = parseInt(req.params.id);
    const result = yield db_1.db.delete(schema_1.tasks).where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
    res.json(result);
});
exports.deleteTask = deleteTask;
