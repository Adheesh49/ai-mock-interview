'use client'; 
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Webcam from 'react-webcam';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import { Lightbulb, Mic, MicOff, Video, VideoOff } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { getInterviewDetailsById } from './actions';
import { saveUserAnswer } from './db_actions';

export default function InterviewPage() {
  const { interviewId } = useParams();
  const router = useRouter();
  const [interviewData, setInterviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [webcamEnabled, setWebcamEnabled] = useState(false); // For preview
  

  const [isLiveCameraOn, setIsLiveCameraOn] = useState(true);

  const { transcript, listening, resetTranscript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const result = await getInterviewDetailsById(interviewId);
      if (result && result.length > 0) {
        setInterviewData({ ...result[0], questions: JSON.parse(result[0].jsonockResp).questions });
      }
      setLoading(false);
    };
    if (interviewId) fetchData();
  }, [interviewId]);

  const handleStartInterview = () => { 
    // Automatically turn the camera on when the interview starts, if it was off
    setIsLiveCameraOn(true);
    setInterviewStarted(true); 
    toast.success("Interview Started!"); 
  };

  const handleStartStopRecording = async () => {
    if (listening) { SpeechRecognition.stopListening(); } 
    else {
      if (!browserSupportsSpeechRecognition) { toast.error("Speech recognition not supported in this browser."); return; }
      resetTranscript();
      await SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
    }
  };

  const handleNextOrFinish = async () => {
    if (listening) SpeechRecognition.stopListening();
    if (transcript.trim()) {
      await saveUserAnswer(interviewId, interviewData?.questions[activeQuestionIndex]?.question, transcript);
      toast.success("Answer saved.");
    }
    resetTranscript();
    if (activeQuestionIndex < interviewData?.questions?.length - 1) {
      setActiveQuestionIndex(activeQuestionIndex + 1);
    } else {
      toast.info("Interview complete! Redirecting to feedback...");
      router.push(`/dashboard/interview/${interviewId}/feedback`);
    }
  };

  const handlePreviousQuestion = () => {
    if (activeQuestionIndex > 0) {
      if (listening) SpeechRecognition.stopListening();
      resetTranscript();
      setActiveQuestionIndex(activeQuestionIndex - 1);
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="p-4 md:p-8">
      <Toaster richColors />
      {interviewStarted ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col gap-4">
            <div className="p-4 border rounded-lg bg-gray-100"><h2 className="text-lg font-semibold">Role: {interviewData.jobPosition}</h2></div>
            <div className="p-4 border rounded-lg"><h3 className="text-md font-semibold mb-2 flex items-center gap-2"><Lightbulb className="text-yellow-400" /> Question #{activeQuestionIndex + 1} of {interviewData?.questions?.length}</h3><p>{interviewData?.questions[activeQuestionIndex]?.question}</p></div>
            <div className="p-4 border rounded-lg bg-gray-50 h-64 overflow-y-auto">
              <h3 className="font-semibold mb-2">Your Answer Transcript:</h3>
              <p className="text-sm text-gray-700">{transcript || "Click the microphone to begin..."}</p>
            </div>
            <div className="flex justify-center mt-2">
              <button onClick={handleStartStopRecording} className={`p-4 rounded-full transition-colors text-white ${listening ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'}`}>{listening ? <MicOff size={24} /> : <Mic size={24} />}</button>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center">
            {/* =============================================== */}
            {/* ===> CONDITIONAL WEBCAM DISPLAY <=== */}
            {/* =============================================== */}
            <div className="w-full h-[350px] bg-black rounded-lg flex items-center justify-center">
              {isLiveCameraOn ? (
                <Webcam mirrored={true} className="rounded-lg h-full w-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-white">
                  <VideoOff size={40} />
                  <p>Camera is Off</p>
                </div>
              )}
            </div>

            <div className="mt-4 flex justify-between items-center w-full max-w-sm">
              {/* Previous Button */}
              {activeQuestionIndex > 0 ? (
                <button onClick={handlePreviousQuestion} className="px-6 py-2 rounded-full bg-gray-300 text-gray-800 font-semibold hover:bg-gray-400">Previous</button>
              ) : (
                <div /> // Spacer
              )}

              {/* Next Button */}
              <button onClick={handleNextOrFinish} className="px-6 py-2 rounded-full bg-green-600 text-white font-semibold hover:bg-green-700">
                {activeQuestionIndex === interviewData?.questions?.length - 1 ? "Finish" : "Next"}
              </button>

              {/* =============================================== */}
              {/* ===> NEW CAMERA ON/OFF BUTTON <=== */}
              {/* =============================================== */}
              <button 
                onClick={() => setIsLiveCameraOn(!isLiveCameraOn)}
                title={isLiveCameraOn ? "Turn Camera Off" : "Turn Camera On"}
                className={`p-3 rounded-full flex items-center justify-center transition-colors ${isLiveCameraOn ? 'bg-gray-400 hover:bg-gray-500' : 'bg-blue-600 hover:bg-blue-700'}`}
              >
                {isLiveCameraOn ? <VideoOff size={20} className="text-white" /> : <Video size={20} className="text-white" />}
              </button>
            </div>
          </div>
        </div>
      ) : (
        // SETUP SCREEN (Unchanged)
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
          <h2 className="text-2xl font-bold text-center">Ready for your Mock Interview?</h2>
          <div className="w-full max-w-xl p-6 border rounded-lg flex flex-col items-center gap-4">
            <div className="w-full h-64 bg-black rounded-lg flex items-center justify-center">{webcamEnabled ? (<Webcam audio={false} mirrored={true} className="rounded-lg h-full w-full object-cover" />) : (<div className="flex flex-col items-center gap-2 text-white"><Video size={40} /><p>Camera Preview is Off</p></div>)}</div>
            <div className="flex items-center justify-center gap-4"><span className="font-semibold text-gray-700">Enable Camera Preview</span><button onClick={() => setWebcamEnabled(!webcamEnabled)} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${webcamEnabled ? 'bg-blue-600' : 'bg-gray-300'}`}><span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${webcamEnabled ? 'translate-x-6' : 'translate-x-1'}`} /></button></div>
          </div>
          <div className="p-4 bg-yellow-100 border-l-4 border-yellow-500 rounded-lg text-yellow-800 max-w-xl text-left"><div className="flex items-center gap-3"><Lightbulb size={20} /><h3 className="text-lg font-bold">Information</h3></div><p className="mt-2 text-sm">The interview has {interviewData?.questions?.length || 5} questions. You'll get a report based on your answers.</p></div>
          <div className="mt-4"><button onClick={handleStartInterview} className="px-8 py-3 rounded-lg bg-green-600 text-white font-bold text-xl hover:bg-green-700 transition-colors shadow-lg">Start Interview</button></div>
        </div>
      )}
    </div>
  );
}