import { db } from '@/utils/db';
import { UserAnswer, MockInterview } from '@/utils/schema';
import { eq } from 'drizzle-orm';
import { Lightbulb, Mic, MessageSquareQuote, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { generateSingleAIFeedback } from '../feedback_action';

async function FeedbackPage({ params }) {
  // The data fetching logic is unchanged and correct.
  const [interviewDetailsResult, userAnswers] = await Promise.all([
    db.select().from(MockInterview).where(eq(MockInterview.mockId, params.interviewId)),
    db.select().from(UserAnswer).where(eq(UserAnswer.mockIdRef, params.interviewId))
  ]);

  if (!interviewDetailsResult.length) {
    return <div className="p-10 text-center"><h1>Interview Not Found</h1></div>;
  }
  
  const interviewDetails = interviewDetailsResult[0];
  const originalQuestions = JSON.parse(interviewDetails.jsonockResp).questions;

  let feedbackList = [];
  let successfulFeedbacks = [];

  if (userAnswers.length > 0) {
    const feedbackPromises = userAnswers.map(userAnswer => {
      const originalQuestion = originalQuestions.find(q => q.question === userAnswer.question);
      const idealAnswer = originalQuestion ? originalQuestion.answer : "No ideal answer found.";
      
      return generateSingleAIFeedback(interviewDetails, userAnswer.question, idealAnswer, userAnswer.userAnswer)
        .then(feedback => ({ ...userAnswer, ...feedback, idealAnswer }));
    });

    feedbackList = await Promise.all(feedbackPromises);
    successfulFeedbacks = feedbackList.filter(item => item.rating > 0);
  }
  
  const averageRating = successfulFeedbacks.length > 0 
    ? (successfulFeedbacks.reduce((sum, item) => sum + item.rating, 0) / successfulFeedbacks.length) 
    : 0;
  
  return (
    <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800">Interview Feedback Report</h1>
      <h2 className="text-xl font-semibold mt-2 text-gray-600">For: <span className="text-gray-800">{interviewDetails.jobPosition}</span></h2>
      
      {feedbackList.length > 0 ? (
        <>
          <div className="mt-6 p-6 bg-white border rounded-lg shadow-md text-center">
            <h3 className="text-lg font-bold text-blue-800">Your Overall Rating</h3>
            <p className="text-5xl font-extrabold text-blue-600 mt-2">{averageRating.toFixed(1)} / 10</p>
            <p className="text-sm text-gray-500">(Based on successfully rated answers)</p>
          </div>

          <div className="mt-8 space-y-8">
            {feedbackList.map((item, index) => (
              <div key={item.id} className="p-6 border bg-white rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800"><span className="font-bold">Question {index + 1}:</span> {item.question}</h3>
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-gray-100 rounded-lg"><h4 className="font-semibold flex items-center gap-2 text-gray-700"><Mic /> Your Answer:</h4><p className="text-gray-700 mt-2 italic">"{item.userAnswer}"</p></div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg"><h4 className="font-semibold flex items-center gap-2 text-green-800"><CheckCircle /> Ideal Answer:</h4><p className="text-gray-700 mt-2">{item.idealAnswer}</p></div>
                  
                  {/* ===> THIS IS THE IMPROVED UI LOGIC <=== */}
                  {item.rating > 0 ? (
                    <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 text-yellow-800"><Lightbulb /> AI Feedback:</h4>
                      <p className="text-gray-800 mt-2">{item.feedback}</p>
                      <p className="mt-3 font-bold text-right">Rating: <span className="text-lg text-blue-600">{item.rating}/10</span></p>
                    </div>
                  ) : (
                    <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                      <h4 className="font-semibold flex items-center gap-2 text-red-800"><AlertTriangle /> AI Feedback Error:</h4>
                      <p className="text-gray-800 mt-2">{item.feedback}</p>
                    </div>
                  )}

                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-8 p-10 text-center bg-white border rounded-lg"><h1 className="text-2xl font-bold">No Answers Submitted</h1></div>
      )}
      <div className="mt-10 text-center"><Link href="/dashboard"><button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700">Start a New Interview</button></Link></div>
    </div>
  );
}
export default FeedbackPage;