import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req) {
  if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY is not set in the environment variables.");
    return NextResponse.json(
      { error: "Server configuration error: Missing API Key." },
      { status: 500 }
    );
  }

  const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  try {
    // 1. Get the user's input from the front-end
    const { jobPosition, jobDesc, jobExperience } = await req.json();

    // 2. Create the new, dynamic prompt using the user's input
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

      For each question, provide a short, ideal answer from the candidate's perspective, explaining what a good response should cover.

      IMPORTANT: Provide the output as a single, valid JSON object. The object must have a key named "questions" which holds an array of 5 objects. Each object in the array must have two keys: "question" and "answer". Do not include any text or formatting outside of this JSON object.
    `;

    // 3. Call the Gemini API with the new prompt
    const result = await genAI.models.generateContent({
      model: "gemini-1.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
    });

    // 4. Get the response text
    const jsonText = result.text;
    
    if (!jsonText) {
      console.error("--- ERROR IN GENERATE API ROUTE ---");
      console.error("API returned no text. Prompt might have been blocked.");
      console.error("Full API Response:", JSON.stringify(result, null, 2)); 
      throw new Error("No text response from API. The prompt may have been blocked or the response was empty.");
    }
    
    // 5. Clean and parse the JSON response
    const cleanedJsonText = jsonText.replace('```json', '').replace('```', '').trim();
    const parsedJson = JSON.parse(cleanedJsonText);
    
    // 6. Send the successfully parsed data back to the front-end
    return NextResponse.json(parsedJson);

  } catch (error) {
    console.error("--- ERROR IN GENERATE API ROUTE ---");
    console.error(error);
    console.error("------------------------------------");

    return NextResponse.json(
      { 
        error: "Failed to generate interview questions.", 
        details: error.message || "An unknown error occurred." 
      },
      { status: 500 }
    );
  }
}