
import React from 'react';
import { motion } from 'framer-motion';

export type SessionMode = 'test' | 'practice' | 'interview';

interface ModeSelectorProps {
  onModeSelect: (mode: SessionMode) => void;
}

const modes = [
  {
    id: 'practice',
    title: 'Practice Mode',
    description: 'Practice at your own pace with immediate feedback',
    icon: '📝'
  },
  {
    id: 'test',
    title: 'Test Mode',
    description: 'Test your knowledge with timed assessments',
    icon: '✍️'
  },
  {
    id: 'interview',
    title: 'Interview Mode',
    description: 'Simulate a real interview experience',
    icon: '👥'
  }
] as const;

const ModeSelector: React.FC<ModeSelectorProps> = ({ onModeSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {modes.map((mode, index) => (
        <motion.button
          key={mode.id}
          className="interview-card text-left hover:bg-primary/5 cursor-pointer"
          onClick={() => onModeSelect(mode.id as SessionMode)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl">{mode.icon}</span>
            <div>
              <h3 className="font-semibold text-lg">{mode.title}</h3>
              <p className="text-sm text-muted-foreground">{mode.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default ModeSelector;
