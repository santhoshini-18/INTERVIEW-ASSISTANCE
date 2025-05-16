
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const Analysis = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();

  const { data: sessionData, isLoading: sessionLoading } = useQuery({
    queryKey: ['session', sessionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_sessions')
        .select(`
          *,
          user_responses (*)
        `)
        .eq('id', sessionId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Session not found</h1>
          <button onClick={() => navigate('/')} className="button-primary">
            Return Home
          </button>
        </div>
      </div>
    );
  }

  const accuracy = Math.round((sessionData.correct_answers / sessionData.total_questions) * 100);
  const averageTimePerQuestion = Math.round(sessionData.total_time / sessionData.total_questions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <main className="interview-section">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Session Analysis</h1>
          <p className="text-muted-foreground">
            Here's how you performed in your {sessionData.session_type} session
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card p-6 rounded-xl text-center">
            <h3 className="text-lg font-medium mb-2">Accuracy</h3>
            <p className="text-3xl font-bold text-primary">{accuracy}%</p>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <h3 className="text-lg font-medium mb-2">Questions Completed</h3>
            <p className="text-3xl font-bold text-primary">{sessionData.total_questions}</p>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <h3 className="text-lg font-medium mb-2">Avg. Time per Question</h3>
            <p className="text-3xl font-bold text-primary">{averageTimePerQuestion}s</p>
          </div>
        </div>

        <div className="space-y-4">
          <button
            onClick={() => navigate('/')}
            className="button-primary w-full"
          >
            Start New Session
          </button>
        </div>
      </main>
    </div>
  );
};

export default Analysis;
