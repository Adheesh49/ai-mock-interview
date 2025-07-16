'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getInterviewDetailsById } from './actions'; // Import the server action

export default function InterviewPage() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (interviewId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);

        const result = await getInterviewDetailsById(interviewId);

        // This is where you'll see the data in your browser console
        console.log("Data received on client:", result);

        if (result && !result.error && result.length > 0) {
          setInterviewData(result[0]); // Store the first item from the result array
        } else if (result && result.error) {
          setError(result.error);
        } else {
          setError("Interview not found.");
        }
        
        setLoading(false);
      };

      fetchData();
    }
  }, [interviewId]);

  if (loading) {
    return <div className="p-6 text-center">Loading interview details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Mock Interview Details</h1>

      {interviewData ? (
        <div className="mt-4 p-4 border rounded-lg">
          <h2 className="text-xl font-semibold">Position: {interviewData.jobPosition}</h2>
          <p><strong>Created On:</strong> {interviewData.createdAt}</p>
          <p><strong>Experience Required:</strong> {interviewData.jobExperience} years</p>
          <p><strong>Job Description:</strong> {interviewData.jobDesc}</p>
          
          <h3 className="text-lg font-semibold mt-4">Raw Mock Response:</h3>
          <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded overflow-auto">
            <code>{JSON.stringify(JSON.parse(interviewData.jsonMockResp), null, 2)}</code>
          </pre>
        </div>
      ) : (
        <p>No interview details to display.</p>
      )}
    </div>
  );
}