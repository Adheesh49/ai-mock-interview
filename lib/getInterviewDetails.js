import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';

export async function getInterviewDetailsById(interviewId) {
  const safeId = interviewId.toString(); // enforce string

  console.log('Fetching interview for ID:', safeId);

  const result = await db
    .select()
    .from(MockInterview)
    .where(eq(MockInterview.InterviewId, safeId));

  if (!result.length) return null;

  return {
    ...result[0],
    jsonMockResp: JSON.parse(result[0].jsonMockResp),
  };
}
