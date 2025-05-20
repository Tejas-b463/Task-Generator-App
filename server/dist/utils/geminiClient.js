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
exports.generateTasks = exports.generateAnswer = void 0;
const generative_ai_1 = require("@google/generative-ai");
const genAI = new generative_ai_1.GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const generateAnswer = (_a) => __awaiter(void 0, [_a], void 0, function* ({ question, sources }) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const promptContent = [
            `Question: ${question}`,
            "Sources:",
            ...sources.map((s) => `${s.name}: ${s.content}`),
            "Answer:",
        ].join("\n");
        const result = yield model.generateContent([promptContent]);
        const text = yield result.response.text();
        return text.trim();
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Gemini API error:", error.message);
            throw new Error("Failed to generate answer");
        }
        else {
            console.error("Unknown error:", error);
            throw new Error("Failed to generate answer");
        }
    }
});
exports.generateAnswer = generateAnswer;
const generateTasks = (topic) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;
        const result = yield model.generateContent([prompt]);
        const text = yield result.response.text();
        return text
            .split("\n")
            .map(t => t.trim())
            .filter(t => t.length > 0);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error("Gemini API error:", error.message);
            throw new Error("Failed to generate tasks");
        }
        else {
            console.error("Unknown error:", error);
            throw new Error("Failed to generate tasks");
        }
    }
});
exports.generateTasks = generateTasks;
