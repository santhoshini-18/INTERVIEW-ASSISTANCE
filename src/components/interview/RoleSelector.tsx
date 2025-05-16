
import React from 'react';
import { motion } from 'framer-motion';

export type InterviewRole = 'software' | 'aiml' | 'data' | 'security';

interface RoleSelectorProps {
  onRoleSelect: (role: InterviewRole) => void;
}

const roles = [
  {
    id: 'software',
    title: 'Software Developer',
    description: 'Focus on algorithms, system design, and coding practices',
    icon: '💻'
  },
  {
    id: 'aiml',
    title: 'AI/ML Developer',
    description: 'Emphasis on machine learning concepts and implementations',
    icon: '🤖'
  },
  {
    id: 'data',
    title: 'Data Analyst',
    description: 'Cover data processing, visualization, and insights',
    icon: '📊'
  },
  {
    id: 'security',
    title: 'Cybersecurity Engineer',
    description: 'Focus on security protocols and threat detection',
    icon: '🔒'
  }
] as const;

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {roles.map((role, index) => (
        <motion.button
          key={role.id}
          className="interview-card text-left hover:bg-primary/5 cursor-pointer"
          onClick={() => onRoleSelect(role.id as InterviewRole)}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <div className="flex items-start gap-4">
            <span className="text-2xl">{role.icon}</span>
            <div>
              <h3 className="font-semibold text-lg">{role.title}</h3>
              <p className="text-sm text-muted-foreground">{role.description}</p>
            </div>
          </div>
        </motion.button>
      ))}
    </div>
  );
};

export default RoleSelector;
