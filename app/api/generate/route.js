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
      You are an expert technical hiring manager creating an interview for a "${jobPosition}" role with ${jobExperience} years of experience, focusing on skills like "${jobDesc}".
      Your Task: Generate exactly 5 interview questions.
      Output Format Requirement: Provide the output as a single, valid JSON object with a key named "questions" holding an array of 5 objects.
      Each object must have two keys: "question" and "answer".
      - "question": The interview question as a string.
      - "answer": A concise, high-quality example answer a top candidate might give. This must be a direct, first-person answer. DO NOT describe what a good answer should be; PROVIDE the good answer itself.
    `;
    

    let parsed;
    try {
      const result = await genAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
      });
      
      const rawText = result.text;
      if (!rawText) {
        throw new Error("AI returned an empty or invalid response.");
      }
      
      const cleaned = rawText.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(cleaned);

    } catch (aiError) {
      console.error("AI Generation Failed:", aiError.message);
      
      return NextResponse.json(
        { error: "Failed to generate questions from AI. You may have exceeded the daily usage limit. Please try again later." },
        { status: 429 } // 429 is the standard code for "Too Many Requests"
      );
    }


    const mockId = uuidv4();
    const createdAt = new Date().toISOString();
    const createdBy = "guest"; 

    await db.insert(MockInterview).values({
      jsonockResp: JSON.stringify(parsed), 
      jobPosition,
      jobDesc,
      jobExperience: jobExperience.toString(), 
      createdBy,
      createdAt,
      mockId,
    });

    return NextResponse.json({ success: true, mockId });

  } catch (error) {
    console.error("ERROR in /api/generate:", error);
    return NextResponse.json(
      { error: "Failed to save the interview to the database.", details: error.message },
      { status: 500 }
    );
  }
}