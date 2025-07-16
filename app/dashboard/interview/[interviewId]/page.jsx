'use client'; 

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { getInterviewDetailsById } from './actions';
import Webcam from 'react-webcam';
import { Lightbulb, Mic, Video, VideoOff } from 'lucide-react';
import Link from 'next/link';

export default function InterviewPage() {
  const { interviewId } = useParams();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States for controlling the UI and functionality
  const [webcamEnabled, setWebcamEnabled] = useState(false); // For the preview toggle
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);

  // Separate state for the camera during the actual interview
  const [isLiveCameraOn, setIsLiveCameraOn] = useState(true);

  useEffect(() => {
    // This data fetching useEffect remains the same
    if (interviewId) {
      const fetchData = async () => {
        setLoading(true);
        setError(null);
        const result = await getInterviewDetailsById(interviewId);
        if (result && !result.error && result.length > 0) {
          const parsedQuestions = JSON.parse(result[0].jsonMockResp);
          setInterviewData({ ...result[0], questions: parsedQuestions.questions });
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
    return <div className="p-6 text-center">Loading Interview Details...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-4 md:p-8">
      {interviewStarted ? (
        
        // LIVE INTERVIEW SCREEN

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Questions Section (Unchanged) */}
          <div className="flex flex-col gap-4">
            <div className="p-4 border rounded-lg bg-gray-100 dark:bg-gray-800"><h2 className="text-lg font-semibold"><strong>Job Role:</strong> {interviewData.jobPosition}</h2><h3 className="text-sm text-gray-500"><strong>Experience:</strong> {interviewData.jobExperience} years</h3></div>
            <div className="p-4 border rounded-lg h-[400px] overflow-y-auto"><h3 className="text-md font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-yellow-400" /> Question #{activeQuestionIndex + 1}</h3><p>{interviewData.questions[activeQuestionIndex]?.question}</p></div>
            <div className="flex justify-between items-center mt-2"><button onClick={() => setActiveQuestionIndex(Math.max(0, activeQuestionIndex - 1))} disabled={activeQuestionIndex === 0} className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 disabled:opacity-50">Previous</button><button onClick={() => setActiveQuestionIndex(Math.min(interviewData.questions.length - 1, activeQuestionIndex + 1))} disabled={activeQuestionIndex === interviewData.questions.length - 1} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50">Next</button></div>
          </div>
          
          {/* Webcam & Controls Section with Toggle */}
          <div className="flex flex-col items-center justify-center">
            {isLiveCameraOn ? (<Webcam mirrored={true} className="rounded-lg shadow-lg border-2 w-full h-auto" />) : (<div className="h-[350px] w-full max-w-md bg-gray-900 rounded-lg flex flex-col items-center justify-center"><VideoOff size={40} className="text-gray-400" /><p className="mt-2 text-gray-400">Camera is off</p></div>)}
            <div className="mt-4 flex gap-4 items-center">
              <button className="px-6 py-2 rounded-full bg-red-600 text-white flex items-center gap-2 hover:bg-red-700" onClick={() => console.log("Start Recording...")}><Mic size={20} /> Start Recording</button>
              <Link href="/dashboard"><button className="px-6 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-800">End Interview</button></Link>
              {/* Live Camera Toggle */}
              <button onClick={() => setIsLiveCameraOn(!isLiveCameraOn)} className={`p-3 rounded-full flex items-center justify-center transition-colors ${isLiveCameraOn ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}>
                {isLiveCameraOn ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
              </button>
            </div>
          </div>
        </div>
      ) : (

        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
          <h2 className="text-2xl font-bold text-center">Ready for your Mock Interview?</h2>

          <div className="w-full max-w-xl p-6 border rounded-lg flex flex-col items-center gap-4">
            
            {/* Webcam Preview Area */}
            <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center">
              {webcamEnabled ? (
                <Webcam audio={false} mirrored={true} className="rounded-lg h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white">
                  <Video size={40} />
                  <p>Camera Preview is Off</p>
                </div>
              )}
            </div>

            {/* The Toggle Switch Control */}
            <div className="flex items-center justify-center gap-4">
              <span className="font-semibold text-gray-700">Enable Camera Preview</span>
              <button
                onClick={() => setWebcamEnabled(!webcamEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  webcamEnabled ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    webcamEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Information Box */}
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg text-yellow-800 max-w-xl text-left">
            <div className="flex items-center gap-3"><Lightbulb size={20} /><h3 className="text-lg font-bold">Information</h3></div>
            <p className="mt-2 text-sm">The interview has {interviewData?.questions?.length || 5} questions. You'll get a report based on your answers. <strong>NOTE:</strong> We never record your video.</p>
          </div>
          
          {/* Start Interview Button */}
          <div className="mt-4">
            <button
              onClick={() => setInterviewStarted(true)}
              className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold text-xl hover:bg-green-700 transition-colors shadow-lg"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}