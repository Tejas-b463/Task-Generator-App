import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface Source {
  name: string;
  content: string;
}

interface GenerateAnswerParams {
  question: string;
  sources: Source[];
}

export const generateAnswer = async ({ question, sources }: GenerateAnswerParams): Promise<string> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const promptContent = [
      `Question: ${question}`,
      "Sources:",
      ...sources.map((s) => `${s.name}: ${s.content}`),
      "Answer:",
    ].join("\n");

    const result = await model.generateContent([promptContent]);
    const text = await result.response.text();

    return text.trim();
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Gemini API error:", error.message);
      throw new Error("Failed to generate answer");
    } else {
      console.error("Unknown error:", error);
      throw new Error("Failed to generate answer");
    }
  }
};

export const generateTasks = async (topic: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Generate a list of 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;

    const result = await model.generateContent([prompt]);
    const text = await result.response.text();

    return text
      .split("\n")
      .map(t => t.trim())
      .filter(t => t.length > 0);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Gemini API error:", error.message);
      throw new Error("Failed to generate tasks");
    } else {
      console.error("Unknown error:", error);
      throw new Error("Failed to generate tasks");
    }
  }
};
