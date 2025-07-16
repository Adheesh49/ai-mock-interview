// This is a Server Component, so it can fetch data directly.
import AddNewInterview from './_components/AddNewInterview';
import Link from 'next/link';
import { db } from '@/utils/db';
import { MockInterview } from '@/utils/schema';
import { desc } from 'drizzle-orm';
import { Button } from '@/components/ui/button';

async function Dashboard() {
  
  // This query now fetches ALL interviews for debugging purposes.
  // The user filter has been temporarily removed.
  const interviews = await db.select()
    .from(MockInterview)
    .orderBy(desc(MockInterview.id));

  return (
    <div className='p-10'>
      <h2 className='font-bold text-3xl text-primary'>Dashboard</h2>
      <h2 className='text-gray-500'>Create and Start your AI Mockup Interview</h2>
      
      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <AddNewInterview/>
      </div>

      {interviews?.length > 0 && (
        <div>
          <h2 className='font-bold text-xl mt-10'>Previous Mock Interview</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-5'>
            {interviews.map((interview) => (
              <div key={interview.id} className="border rounded-lg p-4 bg-white shadow-sm flex flex-col">
                <div className="flex-grow">
                  <h3 className="font-bold text-lg text-blue-800 truncate">{interview.jobPosition}</h3>
                  <p className="text-sm text-gray-600 my-1">{interview.jobExperience} Years of Experience</p>
                  <p className="text-xs text-gray-400">
                    Created At: {new Date(interview.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-4 gap-4">
                  <Link href={`/dashboard/interview/${interview.mockId}/feedback`} className="w-full">
                    <Button size="sm" variant="outline" className="w-full">Feedback</Button>
                  </Link>
                  <Link href={`/dashboard/interview/${interview.mockId}`} className="w-full">
                    <Button size="sm" className="w-full">Start</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard;