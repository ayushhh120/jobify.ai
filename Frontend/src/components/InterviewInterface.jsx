

import { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Square, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios'



export const InterviewInterface = () => {
   const [jobTitle, setJobTitle] = useState('');
  const [skills, setSkills] = useState('');
const [showJobForm, setShowJobForm] = useState(true);
const [isFormValid, setIsFormValid] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
const [mediaRecorder, setMediaRecorder] = useState(null);
const [audioChunks, setAudioChunks] = useState([]);
const [sampleFeedback, setSampleFeedback] = useState([]);
const [allAnswers, setAllAnswers] = useState([]);
const [finalSummary, setFinalSummary] = useState("");
const [loadingQuestions, setLoadingQuestions] = useState(false);

 

useEffect(() => {
  setIsFormValid(jobTitle.trim() !== "" && skills.trim() !== "");
}, [jobTitle, skills]);

   const handleJobFormSubmit = async () => {
  setShowJobForm(false); // Hide form and show interview screen
  setShowFeedback(false);
  setUserAnswer('');
  setQuestions([]);
  setAllAnswers([]);

  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-questions`, {
      jobTitle,
      skills: skills.split(",").map(skill => skill.trim())
    });
    setQuestions(res.data.questions);
  } catch (error) {
    console.error("Failed to fetch questions", error);
    alert("Error generating questions. Please try again.");
    setInterviewStarted(false);
    setShowJobForm(true);
  }
};

  const handleStartInterview = async () => {
     try {
    setLoadingQuestions(true);
    setInterviewStarted(true);
    setCurrentQuestion(0);
    setShowFeedback(false);
    setUserAnswer('');
    
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-questions`, {
      jobTitle: "Frontend Developer",
      skills: ["React", "JavaScript", "Tailwind"]
    });

    setQuestions(res.data.questions);
  } catch (error) {
    console.error("Failed to fetch questions", error);
    alert("Something went wrong while fetching interview questions.");
  }  finally {
    setLoadingQuestions(false);
  }

  };

 


 const handleRecordToggle = async () => {
  if (!isRecording) {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    console.log("Mic access granted");
    const recorder = new MediaRecorder(stream);
    const chunks = [];

    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: 'audio/webm' });
      const formData = new FormData();
      formData.append("audio", audioBlob, "recording.webm");

      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/ai/transcribe-audio`, {
        method: "POST",
        body: formData
      });

      const data = await res.json();
        const transcript = data.transcript || "Could not transcribe audio. Please Try Again";
        setUserAnswer(transcript);
        showFeedback(false);
      
       setAllAnswers(prev => {
    const updated = [...prev];
    updated[currentQuestion] = data.transcript || "";
    return updated;
  });

   const feedback = await fetchAIResponseFeedback(transcript || "");
      setSampleFeedback(feedback);
      setShowFeedback(true);
    };

    recorder.start();
    setIsRecording(true);
    setMediaRecorder(recorder);
    setAudioChunks(chunks);

    setTimeout(() => {
      recorder.stop();
      setIsRecording(false);
    }, 30000);
  } else {
    mediaRecorder?.stop();
    setIsRecording(false);
  }
};

const fetchAIResponseFeedback = async (text) => {
  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-feedback`, {
      answer: text,
    });
    return res.data.feedback;
  } catch (error) {
    console.error("Failed to fetch AI feedback", error);
    return [];
  }
};

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
    setCurrentQuestion(currentQuestion + 1);
    setUserAnswer('');
    setShowFeedback(false);
  }
  };

  const getScoreColor = (color) => {
    switch (color) {
      case 'success': return 'text-green-500';
      case 'warning': return 'border-yellow-500';
      case 'destructive': return 'text-red-500';
      default: return ' text-gray-500';
    }
  };

  const getScoreStars = (score, maxScore) => {
    return '⭐'.repeat(score) + '☆'.repeat(maxScore - score);
  };

  useEffect(() => {
  const fetchFinalSummary = async () => {
    if (currentQuestion === 4 && showFeedback) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-summary`, {
          answers: allAnswers,
        });
        setFinalSummary(res.data.summary);
      } catch (error) {
        console.error("Failed to get final summary", error);
      }
    }
  };
  fetchFinalSummary();
}, [currentQuestion, showFeedback, allAnswers]);


  // Job Form Screen
  if (showJobForm) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <div className="w-full max-w-lg animate-fade-in">
          <Card className="glassmorphic p-8 card-glow">
            <div className="space-y-6">
              {/* Header */}
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-bold text-gray-400">
                  🎤 Start Your Mock Interview
                </h2>
                <p className="text-gray-400 text-sm">
                  Enter your job title and top skills so AI can personalize your interview.
                </p>
              </div>

             
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-gray-400 font-medium">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    type="text"
                    placeholder="e.g. Frontend Developer"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-gray-400 mt-2 placeholder:text-gray-400 focus:ring-indigo-500/70 transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="skills" className="text-gray-400 font-medium">
                    Skills
                  </Label>
                  <Input
                    id="skills"
                    type="text"
                    placeholder="e.g. React, JavaScript, Tailwind"
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    className="bg-gray-800/50 border-gray-700 text-gray-400 mt-2  placeholder:text-gray-400 focus:ring-blue-500/50 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleJobFormSubmit}
                disabled={!isFormValid}
                className={`w-full py-3 transition-all duration-300 border-0 font-medium ${
                  isFormValid 
                    ? 'gradient-button hover:scale-105 shadow-xl bg-gray-800/50' 
                    : 'bg-gray-800/50 text-gray-400 cursor-not-allowed'
                }`}
                size="lg"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Interview
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

// Welcome screen
  if (!interviewStarted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <div className="w-full max-w-xl text-center space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-400">
              Ace Your Next
              <span className="block text-transparent bg-gradient-to-r from-blue-300 to-purple-800 bg-clip-text">
                Interview!
              </span>
            </h1>
            <p className="text-xl  text-gray-500 max-w-md mx-auto leading-relaxed">
              Practice with AI. Get smart feedback. Boost your confidence.
            </p>
          </div>

          {/* Start Interview Button */}
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto gradient-button rounded-full flex items-center justify-center shadow-lg">
                <Mic className="w-8 h-8 bg-gray-800/50" />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-semibold text-gray-400">Ready to begin?</h3>
                <p className=" text-gray-500 text-sm">
                  We'll ask you 5 questions and provide detailed feedback on your performance.
                </p>
                <Button 
                  onClick={handleStartInterview}
                  className="w-full gradient-button hover:scale-105 transition-all duration-300 shadow-xl border-0 bg-gray-800/50 font-medium py-3"
                  size="lg"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Start Mock Interview
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero p-6">
      <div className="max-w-4xl mx-auto space-y-8 py-8">
      

        {/* Progress Indicator */}
        <div className="text-center space-y-2 animate-fade-in">
          <p className=" text-gray-500 text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </p>
          <div className="w-full bg-gray-800  rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Box */} 
        <Card className="glassmorphic p-8 card-glow animate-scale-in">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm  text-gray-500 font-medium">AI Interviewer</span>
            </div>
      {loadingQuestions ? (
  <div className="text-center text-xl text-gray-400 mt-8 animate-pulse">
    Please wait, questions are loading...
  </div>
) : (
  questions.length > 0 && (
    <h2 className="text-2xl font-semibold text-gray-400 leading-relaxed">
      {questions[currentQuestion]}
    </h2>
  )
)}

          </div>
        </Card>

        {/* Answer Section */}
        <Card className="glassmorphic p-8 card-glow">
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <Button
                onClick={handleRecordToggle}
                className={`w-20 h-20 rounded-full transition-all duration-300 ${
                  isRecording 
                    ? 'bg-red-500 hover:bg-red-500/90 pulse-record' 
                    : 'gradient-button hover:scale-110'
                } border-0 shadow-xl`}
              >
                {isRecording ? (
                  <Square className="w-8 h-8 text-white" />
                ) : (
                  <Mic className="w-8 h-8 bg-gray-800/50" />
                )}
              </Button>
              <p className=" text-gray-500 text-sm">
                {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
              </p>
            </div>

            {userAnswer && (
              <div className="space-y-3 animate-fade-in">
                <h3 className="text-lg font-medium text-gray-400">Your Answer:</h3>
                <div className="bg-gray-800 /50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
                  <p className="text-gray-400 leading-relaxed">{userAnswer}</p>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Feedback Section */}
        {showFeedback && (
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-400">AI Feedback</h3>
              <div className="grid gap-4">
                {sampleFeedback.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800 /30 rounded-lg border border-gray-700">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-400">{item.category}</span>
                        <span className="text-2xl">{getScoreStars(item.score, item.maxScore)}</span>
                      </div>
                      <p className="text-sm  text-gray-500">{item.feedback}</p>
                    </div>
                    <div className={`text-lg font-semibold ${getScoreColor(item.color)}`}>
                      {item.score}/{item.maxScore}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4">
                {currentQuestion < questions.length - 1 ? (
                  <Button 
                    onClick={handleNextQuestion}
                    className="flex-1 gradient-button hover:scale-105 transition-all duration-300 border-0 bg-gray-800/50"
                  >
                    Next Question
                  </Button>
                ) : (
                  <Button 
                    onClick={() => setInterviewStarted(false)}
                    className="flex-1 gradient-button hover:scale-105 transition-all duration-300 border-0 bg-gray-800/50"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Start Over
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* Final Summary Panel */}
        {showFeedback && currentQuestion === questions.length - 1 && (
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-gray-400">Interview Complete! 🎉</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-500">4.0</div>
                  <div className="text-sm  text-gray-500">Overall Score</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-500">85%</div>
                  <div className="text-sm  text-gray-500">Confidence Level</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold border-yellow-500">Good</div>
                  <div className="text-sm  text-gray-500">Performance</div>
                </div>
              </div>
              {finalSummary ? (
  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap max-w-md mx-auto">
    {finalSummary}
  </p>
) : (
  <p className="text-gray-500">Generating final summary...</p>
)}

            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
