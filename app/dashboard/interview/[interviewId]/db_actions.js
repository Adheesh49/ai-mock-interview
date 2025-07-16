'use server';
import { db } from '@/utils/db';
import { UserAnswer } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server';

export async function saveUserAnswer(mockId, question, userAnswer) {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'guest';
  try {
    await db.insert(UserAnswer).values({
      mockIdRef: mockId,
      question: question,
      userAnswer: userAnswer,
      userEmail: userEmail,
      createdAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error("Error saving answer:", error);
    return { success: false };
  }
}