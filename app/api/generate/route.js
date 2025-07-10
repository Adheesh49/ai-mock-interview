import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { db } from "@/utils/db"; 
import { MockInterview } from "@/utils/schema";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set.");
    return NextResponse.json({ error: "Missing API Key." }, { status: 500 });
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    const { jobPosition, jobDesc, jobExperience } = await req.json();

    const prompt = `
      You are an expert technical hiring manager for a top tech company. Your task is to generate relevant interview questions for a candidate.

      Based on the following job details:
      - Job Role: "${jobPosition}"
      - Job Description / Required Skills: "${jobDesc}"
      - Years of Experience: "${jobExperience}"

      Please generate exactly 5 interview questions. These questions should be a good mix of:
      1. Technical questions relevant to the required skills.
      2. Behavioral questions to assess soft skills and experience.
      3. Scenario-based questions that test problem-solving abilities.

      Tailor the difficulty of the questions to a candidate with approximately ${jobExperience} years of experience.

      IMPORTANT: Provide the output as a single, valid JSON object. The object must have a key named "questions" which holds an array of 5 objects. Each object in the array must have two keys: "question" and "answer". Do not include any text or formatting outside of this JSON object.
    `;

    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    const rawText = result.text;
    if (!rawText) throw new Error("Empty response from Gemini API.");

    const cleaned = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    const mockId = uuidv4();
    const createdAt = new Date().toISOString();
    const createdBy = "guest"; // Replace with session if auth exists

    await db.insert(MockInterview).values({
      jsonMockResp: JSON.stringify(parsed),
      jobPosition,
      jobDesc,
      jobExperience,
      createdBy,
      createdAt,
      mockId,
    });

    return NextResponse.json({ success: true, mockId, questions: parsed.questions });

  } catch (error) {
    console.error("ERROR in /api/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate and save interview questions.", details: error.message },
      { status: 500 }
    );
  }
}
