

import { useState, useEffect } from 'react';
import { Mic, MicOff, Play, Square, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import axios from 'axios'
import { useTextToSpeech } from "@/hooks/useTextToSpeech";



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
const [allFeedback, setAllFeedback] = useState([]); // Store feedback for all questions
const [finalSummary, setFinalSummary] = useState("");
const [loadingQuestions, setLoadingQuestions] = useState(false);
const [overallScore, setOverallScore] = useState(0);
const [confidenceLevel, setConfidenceLevel] = useState(0);
const [performanceRating, setPerformanceRating] = useState("");
const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(true);
const [speechSupported, setSpeechSupported] = useState(false);



// Check if speech synthesis is supported
useEffect(() => {
  const isSupported = 'speechSynthesis' in window;
  setSpeechSupported(isSupported);
  console.log('Speech synthesis supported:', isSupported);
  
  if (isSupported) {
    console.log('Available voices:', speechSynthesis.getVoices());
  }
}, []);

// Auto-speak when question changes
useEffect(() => {
  if (textToSpeechEnabled && questions.length > 0 && currentQuestion < questions.length) {
    const currentQuestionText = questions[currentQuestion];
    if (currentQuestionText && window.speechSynthesis) {
      // Cancel any existing speech
      speechSynthesis.cancel();
      
      // Create new utterance
      const utterance = new SpeechSynthesisUtterance(currentQuestionText);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      // Get available voices and select a good one
      const voices = speechSynthesis.getVoices();
      const preferredVoice = voices.find(voice => 
        voice.lang === 'en-US' && 
        (voice.name.includes('Google') || voice.name.includes('Natural') || voice.name.includes('Premium'))
      );
      
      if (preferredVoice) {
        utterance.voice = preferredVoice;
      }
      
      // Speak the question
      console.log('Auto-speaking question:', currentQuestionText);
      speechSynthesis.speak(utterance);
    }
  }
}, [currentQuestion, questions, textToSpeechEnabled]);

 

// Generate interview questions from AI
useEffect(() => {
  setIsFormValid(jobTitle.trim() !== "" && skills.trim() !== "");
}, [jobTitle, skills]);

   const handleJobFormSubmit = async () => {
  setShowJobForm(false); // Hide form and show interview screen
  setShowFeedback(false);
  setUserAnswer('');
  setQuestions([]);
  setAllAnswers([]);
  setAllFeedback([]);
  setFinalSummary("");
  setOverallScore(0);
  setConfidenceLevel(0);
  setPerformanceRating("");

  try {
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-questions`, {
      jobTitle,
      skills: skills.split(",").map(skill => skill.trim())
    });
    setQuestions(res.data.questions);
    // Initialize arrays with the correct length
    setAllAnswers(new Array(res.data.questions.length).fill(""));
    setAllFeedback(new Array(res.data.questions.length).fill([]));
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
    setAllAnswers([]);
    setAllFeedback([]);
    setFinalSummary("");
    setOverallScore(0);
    setConfidenceLevel(0);
    setPerformanceRating("");
    
    const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-questions`, {
      jobTitle: jobTitle,
      skills: skills
    });

    setQuestions(res.data.questions);
    // Initialize arrays with the correct length
    setAllAnswers(new Array(res.data.questions.length).fill(""));
    setAllFeedback(new Array(res.data.questions.length).fill([]));
  } catch (error) {
    console.error("Failed to fetch questions", error);
    alert("Something went wrong while fetching interview questions.");
  }  finally {
    setLoadingQuestions(false);
  }

  };

 
const QuestionBox = ({ question }) => {
  const { stopSpeech } = useTextToSpeech(question, textToSpeechEnabled); 

  return (
    <div className="text-lg font-medium mb-4">
      <div className="flex items-center space-x-2">
        {textToSpeechEnabled && (
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        )}
        <span>{question}</span>
      </div>
    </div>
  );
};

// start recording
 const handleRecordToggle = async () => {
  if (!isRecording) {
    // Stop any current text-to-speech when starting recording
    if (window.speechSynthesis) {
      speechSynthesis.cancel();
      console.log("Stopped text-to-speech for recording");
    }

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

// Only show feedback if transcription was successful
if (transcript !== "Could not transcribe audio. Please Try Again") {
  setAllAnswers(prev => {
    const updated = [...prev];
    updated[currentQuestion] = transcript;
    return updated;
  });

  const feedback = await fetchAIResponseFeedback(transcript);
  setSampleFeedback(feedback);
  
  // Store feedback for this question
  setAllFeedback(prev => {
    const updated = [...prev];
    updated[currentQuestion] = feedback;
    return updated;
  });
  
  setShowFeedback(true);
  
  // Debug log to track answers
  console.log(`Answer ${currentQuestion + 1} saved:`, transcript);
  console.log("All answers so far:", [...allAnswers.slice(0, currentQuestion), transcript]);
} else {
  setShowFeedback(false);
}

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

// Fetch AI Feedback
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

// Next question
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
      case 'warning': return 'text-yellow-500';
      case 'destructive': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const getScoreStars = (score, maxScore) => {
    return '⭐'.repeat(score) + '☆'.repeat(maxScore - score);
  };

  // Calculate overall performance metrics
  const calculatePerformanceMetrics = (feedbackArray) => {
    if (!feedbackArray || feedbackArray.length === 0) return { overallScore: 0, confidenceLevel: 0, performanceRating: "" };

    let totalScore = 0;
    let totalMaxScore = 0;
    let confidenceScores = [];
    let clarityScores = [];
    let relevanceScores = [];

    feedbackArray.forEach(questionFeedback => {
      questionFeedback.forEach(feedback => {
        totalScore += feedback.score;
        totalMaxScore += feedback.maxScore;

        // Categorize scores for specific metrics
        if (feedback.category.toLowerCase().includes('confidence')) {
          confidenceScores.push(feedback.score);
        } else if (feedback.category.toLowerCase().includes('clarity')) {
          clarityScores.push(feedback.score);
        } else if (feedback.category.toLowerCase().includes('relevance')) {
          relevanceScores.push(feedback.score);
        }
      });
    });

    // Calculate overall score (average of all scores)
    const overallScore = totalMaxScore > 0 ? Math.round((totalScore / totalMaxScore) * 5 * 10) / 10 : 0;

    // Calculate confidence level (average of confidence scores)
    const avgConfidence = confidenceScores.length > 0 
      ? confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length 
      : 0;
    const confidenceLevel = Math.round((avgConfidence / 5) * 100);

    // Determine performance rating based on overall score
    let performanceRating = "";
    if (overallScore >= 4.5) {
      performanceRating = "Excellent";
    } else if (overallScore >= 3.5) {
      performanceRating = "Good";
    } else if (overallScore >= 2.5) {
      performanceRating = "Average";
    } else if (overallScore >= 1.5) {
      performanceRating = "Needs Improvement";
    } else {
      performanceRating = "Poor";
    }

    return { overallScore, confidenceLevel, performanceRating };
  };

  useEffect(() => {
  const fetchFinalSummary = async () => {
    
    if (currentQuestion === questions.length - 1 && showFeedback && allAnswers.length >= questions.length) {
      try {
        // Filter out any undefined or empty answers and ensure we have exactly 5 answers
        const validAnswers = allAnswers.slice(0, questions.length).filter(answer => answer && answer.trim() !== "");
        
        if (validAnswers.length === questions.length) {
          // Calculate performance metrics
          const metrics = calculatePerformanceMetrics(allFeedback);
          setOverallScore(metrics.overallScore);
          setConfidenceLevel(metrics.confidenceLevel);
          setPerformanceRating(metrics.performanceRating);
          
          console.log("Generating final summary with:", {
            answers: validAnswers,
            questions: questions,
            feedback: allFeedback
          });
          
          const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/ai/generate-summary`, {
            answers: validAnswers,
            questions: questions // Send questions for context
          });
          
          console.log("Final summary response:", res.data);
          setFinalSummary(res.data.summary);
        } else {
          console.log("Not all questions answered yet:", validAnswers.length, "of", questions.length);
        }
      } catch (error) {
        console.error("Failed to get final summary", error);
        console.error("Error details:", {
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        if (error.response?.status === 400) {
          setFinalSummary("Invalid data provided for summary generation.");
        } else if (error.response?.status === 500) {
          setFinalSummary("Server error occurred while generating summary.");
        } else if (error.code === 'NETWORK_ERROR') {
          setFinalSummary("Network error. Please check your connection.");
        } else {
          setFinalSummary("Unable to generate final summary. Please try again.");
        }
      }
    }
  };
  fetchFinalSummary();
}, [questions ,currentQuestion, showFeedback, allAnswers, allFeedback, questions.length]);




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
      <div className="min-h-screen w-full gradient-hero flex items-center justify-center p-6">
        <div className="w-full h-auto max-w-xl text-center space-y-8 animate-fade-in">
          {/* Hero Section */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-400">
              Ace Your Next
              <span className="block text-transparent bg-gradient-to-r from-blue-300 to-purple-800 bg-clip-text">
                Interview!
              </span>
            </h1>
            <p className="text-lg  text-gray-500 max-w-md mx-auto leading-relaxed">
              Practice with AI. Get smart feedback. Boost your confidence.
            </p>
          </div>

          {/* Start Interview Button */}
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="space-y-6">
              <div className="w-20 h-20 mx-auto gradient-button rounded-full flex items-center justify-center shadow-lg">
                <Mic className="w-8 h-8 bg-gray-700/50" />
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
          <div className="flex items-center justify-between mb-4">
            <p className=" text-gray-500 text-sm">
              Question {currentQuestion + 1} of {questions.length}
            </p>
            {speechSupported && (
              <Button
                onClick={() => {
                  const newState = !textToSpeechEnabled;
                  setTextToSpeechEnabled(newState);
                  
                  // If turning off speech, cancel any current speech
                  if (!newState && window.speechSynthesis) {
                    speechSynthesis.cancel();
                  }
                }}
                variant="ghost"
                size="sm"
                className={`hover:text-gray-300 ${
                  textToSpeechEnabled ? 'text-green-400' : 'text-gray-400'
                }`}
              >
                {textToSpeechEnabled ? (
                  <Volume2 className="w-4 h-4" />
                ) : (
                  <VolumeX className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
          <div className="w-full bg-gray-800  rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Box */} 
        <Card className="glassmorphic p-6 card-glow animate-scale-in">
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
    <h2 className="text-xl font-semibold text-gray-400 leading-relaxed">
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
                  <Mic className="w-8 h-8 bg-gray-700/50" />
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
          <Card className="glassmorphic w-full p-5 card-glow animate-scale-in">
            <div className="space-y-6 w-full">
              <h3 className="text-xl font-semibold text-gray-400">AI Feedback</h3>
              <div className="grid grid-cols-1 lg:grid-cols-1 w-full max-w-[1300px] mx-auto gap-4">
                {sampleFeedback.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-800 /30 rounded-lg border border-gray-700">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-sm lg:text-lg text-gray-400">{item.category}</span>
                        <span className="text-xl lg:text-2xl">{getScoreStars(item.score, item.maxScore)}</span>
                      </div>
                      <p className="text-sm text-gray-500">{item.feedback}</p>
                    </div>
                    <div className={`text-md lg:text-lg mr-1 font-semibold ${getScoreColor(item.color)}`}>
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
        {showFeedback && currentQuestion === questions.length - 1 && allAnswers.length >= questions.length && (
          <Card className="glassmorphic p-8 card-glow animate-scale-in">
            <div className="text-center space-y-6">
              <h3 className="text-2xl font-bold text-gray-400">Interview Complete! 🎉</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-green-500">{overallScore.toFixed(1)}</div>
                  <div className="text-sm  text-gray-500">Overall Score</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-500">{confidenceLevel}%</div>
                  <div className="text-sm  text-gray-500">Confidence Level</div>
                </div>
                <div className="space-y-2">
                  <div className={`text-3xl font-bold ${
                    performanceRating === "Excellent" ? "text-green-500" :
                    performanceRating === "Good" ? "text-blue-500" :
                    performanceRating === "Average" ? "text-yellow-500" :
                    performanceRating === "Needs Improvement" ? "text-orange-500" :
                    "text-red-500"
                  }`}>{performanceRating}</div>
                  <div className="text-sm  text-gray-500">Performance</div>
                </div>
              </div>
              {finalSummary && finalSummary.trim() !== "" ? (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-400">Final Performance Summary</h4>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-wrap max-w-2xl mx-auto text-left">
                    {finalSummary}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-400">Final Performance Summary</h4>
                  <p className="text-gray-500">Generating comprehensive summary...</p>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
