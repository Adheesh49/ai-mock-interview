'use server';

import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';

// This function only runs on the server
export async function getInterviewDetailsById(interviewId) {
  try {
    // This query is now correct because `MockInterview.mockId` maps to the `mockId` text column
    const result = await db
      .select()
      .from(MockInterview)
      .where(eq(MockInterview.mockId, interviewId));

    // Drizzle always returns an array, even for one result
    if (result.length === 0) {
      console.log(`No interview found with mockId: ${interviewId}`);
      return null;
    }

    console.log("Server action successful, returning data:", result);
    return result;

  } catch (error) {
    console.error("Error in server action getInterviewDetailsById:", error);
    // Return a structured error so the client can handle it gracefully
    return { error: "Failed to fetch interview details from the database." };
  }
}