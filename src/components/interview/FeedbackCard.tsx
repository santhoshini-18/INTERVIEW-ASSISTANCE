
import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowRight, Brain, Target, Lightbulb, BarChart, Mic } from 'lucide-react';

interface FeedbackMetrics {
  clarity: number;
  technicalAccuracy: number;
  completeness: number;
  confidence: number;
}

interface FeedbackCardProps {
  feedback: {
    score: number;
    metrics: FeedbackMetrics;
    strengths: string[];
    improvements: string[];
    keywordsUsed?: string[];
    details?: {
      technicalTerms?: string[];
      missingConcepts?: string[];
      suggestedTopics?: string[];
    };
  };
  onContinue: () => void;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, onContinue }) => {
  const renderMetricBar = (value: number, label: string, icon: React.ReactNode) => (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        <span>{value}/10</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div 
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ 
            width: `${value * 10}%`,
            backgroundColor: value >= 7 ? '#22c55e' : value >= 4 ? '#eab308' : '#ef4444'
          }}
        />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="interview-card space-y-6"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">Response Analysis</h3>
        <div className="flex items-center space-x-2">
          <BarChart className="h-5 w-5 text-primary" />
          <span className={`text-lg font-semibold ${
            feedback.score >= 7 ? 'text-success' : 'text-warning'
          }`}>
            {feedback.score}/10
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {renderMetricBar(feedback.metrics.clarity, 'Clarity', <Target className="h-4 w-4" />)}
        {renderMetricBar(feedback.metrics.technicalAccuracy, 'Technical Accuracy', <Brain className="h-4 w-4" />)}
        {renderMetricBar(feedback.metrics.completeness, 'Completeness', <CheckCircle className="h-4 w-4" />)}
        {renderMetricBar(feedback.metrics.confidence, 'Confidence', <Lightbulb className="h-4 w-4" />)}
      </div>

      {feedback.keywordsUsed && feedback.keywordsUsed.length > 0 && (
        <div className="bg-muted/10 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Keywords Used</h4>
          <div className="flex flex-wrap gap-2">
            {feedback.keywordsUsed.map((keyword, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full"
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-success flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4" />
            Strengths
          </h4>
          <ul className="space-y-2">
            {feedback.strengths.map((strength, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <span className="text-success">✓</span>
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-medium text-warning flex items-center gap-2 mb-2">
            <AlertCircle className="h-4 w-4" />
            Areas for Improvement
          </h4>
          <ul className="space-y-2">
            {feedback.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start space-x-2 text-sm">
                <span className="text-warning">!</span>
                <span>{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {feedback.details?.suggestedTopics && (
          <div>
            <h4 className="text-sm font-medium text-primary flex items-center gap-2 mb-2">
              <Brain className="h-4 w-4" />
              Suggested Topics to Review
            </h4>
            <ul className="space-y-2">
              {feedback.details.suggestedTopics.map((topic, index) => (
                <li key={index} className="flex items-start space-x-2 text-sm">
                  <span className="text-primary">•</span>
                  <span>{topic}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button 
        onClick={onContinue} 
        className="button-primary w-full flex items-center justify-center gap-2"
      >
        Continue
        <ArrowRight className="h-4 w-4" />
      </button>
    </motion.div>
  );
};

export default FeedbackCard;
