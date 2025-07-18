import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { currentUser } from '@clerk/nextjs/server'; 
import { eq, desc } from 'drizzle-orm';
import Link from 'next/link';
import { Plus } from 'lucide-react';

async function InterviewListPage() {
  const user = await currentUser();
  const userEmail = user?.primaryEmailAddress?.emailAddress || 'guest';

  const interviews = await db.select()
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, userEmail))
    .orderBy(desc(MockInterview.id));

  return (
    <div className="p-6 md:p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Mock Interviews</h1>
        <Link href="/dashboard">
          <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={20} /> New Interview
          </button>
        </Link>
      </div>
      {interviews?.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {interviews.map((interview) => (
            <div key={interview.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
              <h2 className="text-lg font-semibold truncate">{interview.jobPosition}</h2>
              <p className="text-sm text-gray-500 mb-4">Created on: {new Date(interview.createdAt).toLocaleDateString()}</p>
              <Link href={`/dashboard/interview/${interview.mockId}`}>
                <button className="w-full bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">Start Interview</button>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-lg text-gray-600">You haven't created any mock interviews yet.</p>
      )}
    </div>
  );
}
export default InterviewListPage;