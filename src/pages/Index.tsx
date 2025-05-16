
import React, { useState } from 'react';
import QuestionCard from '../components/interview/QuestionCard';
import FeedbackCard from '../components/interview/FeedbackCard';
import ProgressBar from '../components/interview/ProgressBar';
import RoleSelector, { InterviewRole } from '../components/interview/RoleSelector';
import ModeSelector, { SessionMode } from '../components/interview/ModeSelector';
import ConfirmDialog from '../components/interview/ConfirmDialog';
import Timer from '../components/interview/Timer';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const BASE_QUESTIONS_BY_ROLE: Record<InterviewRole, Array<{
  id: number;
  category: string;
  question: string;
}>> = {
  software: [
    {
      id: 1,
      category: 'Algorithms',
      question: 'Explain how you would implement a binary search tree and discuss its time complexity.',
    },
    {
      id: 2,
      category: 'System Design',
      question: 'Design a scalable chat application. What technologies and architecture would you use?',
    },
    {
      id: 3,
      category: 'Coding Practices',
      question: 'What are the SOLID principles? Provide examples of how you\'ve applied them.',
    },
  ],
  aiml: [
    {
      id: 1,
      category: 'Machine Learning',
      question: 'Explain the difference between supervised and unsupervised learning with examples.',
    },
    {
      id: 2,
      category: 'Deep Learning',
      question: 'What are neural networks? Explain the concept of backpropagation.',
    },
    {
      id: 3,
      category: 'Model Evaluation',
      question: 'How do you handle overfitting in machine learning models?',
    },
  ],
  data: [
    {
      id: 1,
      category: 'SQL',
      question: 'Write a SQL query to find the second highest salary from an employee table.',
    },
    {
      id: 2,
      category: 'Data Visualization',
      question: 'What factors do you consider when choosing between different types of charts?',
    },
    {
      id: 3,
      category: 'Analytics',
      question: 'Explain A/B testing and its importance in data-driven decision making.',
    },
  ],
  security: [
    {
      id: 1,
      category: 'Network Security',
      question: 'Explain the concept of public key cryptography and its applications.',
    },
    {
      id: 2,
      category: 'Web Security',
      question: 'What are common web vulnerabilities and how do you prevent them?',
    },
    {
      id: 3,
      category: 'Security Protocols',
      question: 'Describe the OAuth 2.0 flow and its security considerations.',
    },
  ],
};

const QUESTIONS_PER_SESSION = 5;

const generateQuestion = (role: InterviewRole, currentQuestionIndex: number) => {
  const baseQuestions = BASE_QUESTIONS_BY_ROLE[role];
  const baseIndex = currentQuestionIndex % baseQuestions.length;
  const question = baseQuestions[baseIndex];

  return {
    ...question,
    id: currentQuestionIndex + 1,
    question: question.question
  };
};

const generateFeedback = (answer: string) => {
  const wordCount = answer.split(/\s+/).length;
  const technicalTerms = answer.match(/\b(algorithm|complexity|api|database|function|class|method)\b/gi)?.length || 0;
  const score = Math.min(10, Math.floor((wordCount / 50 + technicalTerms) * 2));

  // Calculate individual metrics
  const clarity = Math.min(10, Math.floor((wordCount / 20) * 10));
  const technicalAccuracy = Math.min(10, technicalTerms * 2);
  const completeness = Math.min(10, Math.floor((wordCount / 50) * 10));
  const confidence = 7; // Default confidence score

  return {
    score,
    metrics: {
      clarity,
      technicalAccuracy,
      completeness,
      confidence,
    },
    strengths: [
      wordCount >= 100 ? "Provided a comprehensive response" : "Answered concisely",
      technicalTerms >= 3 ? "Good use of technical terminology" : "Clear explanation",
      "Demonstrated problem-solving approach",
    ],
    improvements: [
      wordCount < 100 ? "Could elaborate more on the solution" : "Consider being more concise",
      technicalTerms < 3 ? "Include more technical details" : "Balance technical terms with explanations",
      "Add specific real-world examples",
    ],
  };
};

const Index = () => {
  const { signOut, session } = useAuth();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<InterviewRole | null>(null);
  const [selectedMode, setSelectedMode] = useState<SessionMode | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState<string[]>([]);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);

  const currentQuestionData = selectedRole 
    ? generateQuestion(selectedRole, currentQuestion)
    : null;

  const isSessionComplete = currentQuestion >= QUESTIONS_PER_SESSION;

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success('Successfully signed out');
    } catch (error: any) {
      toast.error('Error signing out');
    }
  };

  const handleModeSelect = async (mode: SessionMode) => {
    if (!session?.user) {
      toast.error('Please sign in to continue');
      return;
    }

    try {
      setSelectedMode(mode);
      const { data: existingSession, error: sessionError } = await supabase
        .from('interview_sessions')
        .select()
        .eq('candidate_id', session.user.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (sessionError) {
        console.error('Error checking existing session:', sessionError);
        toast.error('Error checking existing session');
        return;
      }

      if (existingSession) {
        setShowConfirmDialog(true);
        return;
      }

      await startNewSession(mode);
    } catch (error: any) {
      console.error('Error in handleModeSelect:', error);
      toast.error('Error starting session');
    }
  };

  const startNewSession = async (mode: SessionMode) => {
    if (!session?.user || !selectedRole) {
      toast.error('Missing required session data');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('interview_sessions')
        .insert({
          candidate_id: session.user.id,
          role: selectedRole,
          status: 'pending'
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating session:', error);
        throw error;
      }

      if (!data?.id) {
        throw new Error('No session ID returned');
      }

      setSessionId(data.id);
      setSelectedMode(mode);
      setStartTime(new Date());
    } catch (error: any) {
      console.error('Error in startNewSession:', error);
      toast.error('Error starting session');
    }
  };

  const handleRoleSelect = (role: InterviewRole) => {
    setSelectedRole(role);
  };

  const handleAnswer = async (answer: string) => {
    if (!sessionId || !startTime || !currentQuestionData) {
      toast.error('Session data is missing');
      return;
    }

    const timeSpent = Math.round((new Date().getTime() - startTime.getTime()) / 1000);

    try {
      await supabase
        .from('user_responses')
        .insert({
          session_id: sessionId,
          question_text: currentQuestionData.question,
          user_answer: answer,
          time_taken: timeSpent,
        });

      setAnswers([...answers, answer]);
      setShowFeedback(true);
      setStartTime(new Date());
    } catch (error: any) {
      console.error('Error saving response:', error);
      toast.error('Error saving response');
    }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setShowConfirmDialog(true);
    }
  };

  const handleConfirmBack = () => {
    setCurrentQuestion((prev) => prev - 1);
    setAnswers((prev) => prev.slice(0, -1));
    setShowFeedback(false);
    setShowConfirmDialog(false);
  };

  const handleContinue = async () => {
    if (isSessionComplete) {
      finishSession();
      return;
    }

    setShowFeedback(false);
    setCurrentQuestion(prev => prev + 1);

    if (sessionId) {
      try {
        await supabase
          .from('user_sessions')
          .update({
            total_questions: currentQuestion + 1,
            correct_answers: answers.length,
            total_time: Math.round((new Date().getTime() - (startTime?.getTime() || 0)) / 1000),
          })
          .eq('id', sessionId);
      } catch (error: any) {
        console.error('Error updating session:', error);
      }
    }
  };

  const handleTimeUp = () => {
    if (!showFeedback) {
      handleAnswer("Time's up - No answer provided");
    }
  };

  const finishSession = () => {
    if (sessionId) {
      navigate(`/analysis/${sessionId}`);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <button onClick={handleSignOut} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              Sign Out
            </button>
          </div>
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold mb-4">AI Interview Assistant</h1>
            <p className="text-white/80">
              Select your role to begin your {QUESTIONS_PER_SESSION}-question interview
            </p>
          </div>
          <RoleSelector onRoleSelect={handleRoleSelect} />
        </main>
      </div>
    );
  }

  if (!selectedMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-end mb-4">
            <button onClick={handleSignOut} className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors">
              Sign Out
            </button>
          </div>
          <div className="text-center mb-12 text-white">
            <h1 className="text-4xl font-bold mb-4">Select Mode</h1>
            <p className="text-white/80">
              Choose how you want to practice your {QUESTIONS_PER_SESSION}-question interview
            </p>
          </div>
          <ModeSelector onModeSelect={handleModeSelect} />
        </main>
      </div>
    );
  }

  if (!currentQuestionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading questions...</h1>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-600">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between mb-4">
          <button 
            onClick={finishSession} 
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            End Session
          </button>
          <button 
            onClick={handleSignOut} 
            className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
          >
            Sign Out
          </button>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">AI Interview Assistant</h1>
          <p className="text-white/80">
            {selectedMode.charAt(0).toUpperCase() + selectedMode.slice(1)} Mode - 
            Question {currentQuestion + 1} of {QUESTIONS_PER_SESSION}
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <ProgressBar current={currentQuestion + 1} total={QUESTIONS_PER_SESSION} />
          {selectedMode !== 'practice' && (
            <Timer duration={300} onTimeUp={handleTimeUp} />
          )}
          {currentQuestion > 0 && (
            <button 
              onClick={handleBack}
              className="w-full px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              Back to Previous Question
            </button>
          )}
        </div>

        <div className="bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl">
          {!showFeedback ? (
            <QuestionCard
              question={currentQuestionData?.question || ''}
              category={currentQuestionData?.category || ''}
              onAnswer={handleAnswer}
            />
          ) : (
            <FeedbackCard
              feedback={generateFeedback(answers[answers.length - 1])}
              onContinue={handleContinue}
            />
          )}
        </div>

        <ConfirmDialog
          isOpen={showConfirmDialog}
          onConfirm={handleConfirmBack}
          onCancel={() => setShowConfirmDialog(false)}
          message="Going back will remove your current answer. Are you sure you want to continue?"
        />
      </main>
    </div>
  );
};

export default Index;
