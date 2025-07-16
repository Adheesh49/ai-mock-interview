'use server';

import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const feedbackPrompt = `
  You are an expert technical hiring manager and a helpful AI assistant.
  Your task is to evaluate a candidate's answer based on its relevance to the question and how it compares to an ideal answer.

  **Job Context:**
  - Position: "{jobPosition}"

  **Interview Question:** 
  "{question}"

  **Ideal Answer for Reference (what a perfect answer might include):** 
  "{idealAnswer}"

  **The Candidate's Actual Answer:** 
  "{userAnswer}"

  **Your Task:**
  Based on the context, please provide a rating and concise feedback. The user's answer might be very different from the ideal one, so focus on whether they understood the question's intent.

  **Provide the output as a single, valid JSON object with ONLY these two keys and no other text or formatting:**
  1. "rating": A numerical rating from 1 to 10. A low score (1-3) means the answer was completely irrelevant. A high score (8-10) means the answer was relevant and well-articulated.
  2. "feedback": A short, sweet, and constructive feedback string (2-3 sentences max).
`;

export async function generateSingleAIFeedback(interviewData, question, idealAnswer, userAnswer) {
  const safeUserAnswer = userAnswer || 'No answer submitted.';

  const prompt = feedbackPrompt
    .replace('{jobPosition}', interviewData.jobPosition || 'N/A')
    .replace('{question}', question)
    .replace('{idealAnswer}', idealAnswer)
    .replace('{userAnswer}', safeUserAnswer);
  
  try {
    // Using the correct object syntax for your library version
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash", 
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });
    
    const rawText = result.text;
    
    if (!rawText) {
      throw new Error("AI returned an empty response.");
    }

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const feedback = JSON.parse(cleaned);
    return feedback;

  } catch (error) {
    console.error("AI Feedback Generation Error:", error.message);
    return { rating: 0, feedback: "Could not generate AI feedback due to an internal error." };
  }
}