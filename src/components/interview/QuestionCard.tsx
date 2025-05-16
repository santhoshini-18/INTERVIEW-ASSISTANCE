
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Send, StopCircle } from 'lucide-react';
import { toast } from 'sonner';

interface QuestionCardProps {
  question: string;
  category: string;
  onAnswer: (answer: string, metrics: AnswerMetrics) => void;
}

interface AnswerMetrics {
  clarity: number;
  technicalAccuracy: number;
  completeness: number;
  confidence: number;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question, category, onAnswer }) => {
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [answerMode, setAnswerMode] = useState<'text' | 'voice'>('text');
  const [confidenceLevel, setConfidenceLevel] = useState(5);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);

  useEffect(() => {
    if (answerMode === 'voice') {
      initializeMediaRecorder();
    }
  }, [answerMode]);

  const initializeMediaRecorder = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          setAudioChunks((chunks) => [...chunks, e.data]);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
        // Here you would typically send this blob to your speech-to-text service
        // For now, we'll just show a success message
        toast.success('Voice recording completed');
        setAnswer('Voice recording processed successfully');
      };

      setMediaRecorder(recorder);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
      setAnswerMode('text');
    }
  };

  const analyzeAnswer = (text: string): AnswerMetrics => {
    const wordCount = text.split(/\s+/).length;
    const technicalTerms = text.match(/\b(algorithm|api|database|function|class|method)\b/gi)?.length || 0;
    const completeness = Math.min(10, Math.floor((wordCount / 50) * 10));
    
    return {
      clarity: Math.min(10, Math.floor((wordCount / 20) * 10)),
      technicalAccuracy: Math.min(10, technicalTerms * 2),
      completeness,
      confidence: confidenceLevel
    };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (answer.trim()) {
      const metrics = analyzeAnswer(answer);
      onAnswer(answer, metrics);
      setAnswer('');
      setConfidenceLevel(5);
    }
  };

  const toggleRecording = () => {
    if (!mediaRecorder) {
      toast.error('Microphone not initialized');
      return;
    }

    if (isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    } else {
      setAudioChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      toast.info('Recording started');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="interview-card space-y-6"
    >
      <div className="mb-4">
        <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">
          {category}
        </span>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">{question}</h3>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={() => setAnswerMode('text')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            answerMode === 'text' ? 'bg-primary text-white' : 'bg-primary/10'
          }`}
        >
          Text
        </button>
        <button
          type="button"
          onClick={() => setAnswerMode('voice')}
          className={`px-4 py-2 rounded-lg transition-colors ${
            answerMode === 'voice' ? 'bg-primary text-white' : 'bg-primary/10'
          }`}
        >
          Voice
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {answerMode === 'text' ? (
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            className="input-field min-h-[120px] w-full"
            placeholder="Type your answer here..."
          />
        ) : (
          <div className="flex flex-col items-center space-y-4 p-8 border-2 border-dashed rounded-lg">
            <button
              type="button"
              onClick={toggleRecording}
              className={`p-4 rounded-full ${
                isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
              } text-white transition-colors`}
            >
              {isRecording ? (
                <StopCircle className="h-6 w-6" />
              ) : (
                <Mic className="h-6 w-6" />
              )}
            </button>
            <p className="text-sm text-muted-foreground">
              {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            How confident are you about your answer? (1-10)
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={confidenceLevel}
            onChange={(e) => setConfidenceLevel(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Not confident</span>
            <span>Very confident</span>
          </div>
        </div>

        <button 
          type="submit" 
          className="button-primary w-full flex items-center justify-center gap-2"
          disabled={!answer.trim() && answerMode === 'text'}
        >
          <Send className="h-4 w-4" />
          Submit Answer
        </button>
      </form>
    </motion.div>
  );
};

export default QuestionCard;
