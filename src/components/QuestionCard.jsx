import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, AlertCircle, CheckCircle, Globe, Database, Shield, Brain } from 'lucide-react';

const TOPIC_CONFIG = {
  web: { icon: Globe, color: 'var(--topic-web)', label: 'Web' },
  database: { icon: Database, color: 'var(--topic-database)', label: 'Database' },
  security: { icon: Shield, color: 'var(--topic-security)', label: 'Security' },
  ai: { icon: Brain, color: 'var(--topic-ai)', label: 'AI' }
};

export default function QuestionCard({ question, selectedOption, onSelect }) {
  if (!question) return null;

  const isAnswered = selectedOption !== undefined;
  const isCorrect = isAnswered && selectedOption === question.correct;
  const correctIndex = question.correct;
  
  const topicConfig = TOPIC_CONFIG[question.topic] || TOPIC_CONFIG.web;
  const TopicIcon = topicConfig.icon;

  return (
    <motion.div 
      key={question.id}
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="glass-panel"
      style={{ width: '100%', marginBottom: '1rem' }}
    >
      {/* Topic and Type Header */}
      <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div 
          className={`topic-badge ${question.topic}`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <TopicIcon size={14} />
          {topicConfig.label}
        </div>
        <span style={{ 
          fontSize: '0.8rem', 
          color: 'var(--text-secondary)',
          background: 'rgba(255,255,255,0.05)',
          padding: '4px 10px',
          borderRadius: '8px'
        }}>
          {question.type === 'calculation' ? '🧮 Esercizio' : '📚 Teoria'}
        </span>
      </div>

      {/* Question Text */}
      <h2 style={{ 
        fontSize: '1.4rem', 
        marginBottom: '2rem', 
        lineHeight: '1.5',
        fontWeight: '600'
      }}>
        {question.question.split('\n').map((line, i) => (
          <React.Fragment key={i}>
            {line}
            {i < question.question.split('\n').length - 1 && <br />}
          </React.Fragment>
        ))}
      </h2>

      {/* Options */}
      <div style={{ display: 'grid', gap: '12px' }}>
        {question.options.map((opt, idx) => {
          const isSelected = selectedOption === idx;
          const isThisCorrect = correctIndex === idx;
          
          // Determine styles
          let borderColor = 'var(--card-border)';
          let bgColor = 'rgba(255,255,255,0.03)';
          let textColor = 'var(--text-secondary)';

          if (isAnswered) {
            if (isThisCorrect) {
              borderColor = 'var(--success)';
              bgColor = 'rgba(16, 185, 129, 0.12)';
              textColor = 'white';
            } else if (isSelected && !isThisCorrect) {
              borderColor = 'var(--error)';
              bgColor = 'rgba(239, 68, 68, 0.12)';
              textColor = 'white';
            } else {
              textColor = 'rgba(255,255,255,0.3)';
            }
          } else if (isSelected) {
            borderColor = 'var(--accent-color)';
            bgColor = 'rgba(59, 130, 246, 0.12)';
            textColor = 'white';
          }

          const optionLetter = String.fromCharCode(65 + idx); // A, B, C, D

          return (
            <motion.button
              key={idx}
              onClick={() => !isAnswered && onSelect(idx)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              style={{
                textAlign: 'left',
                padding: 0,
                borderRadius: '14px',
                border: `2px solid ${borderColor}`,
                background: bgColor,
                color: textColor,
                fontSize: '1rem',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                cursor: isAnswered ? 'default' : 'pointer',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1rem', 
                padding: '1.2rem', 
                width: '100%' 
              }}>
                {/* Option Letter Circle */}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  border: `2px solid ${isAnswered && isThisCorrect ? 'var(--success)' : (isSelected ? 'var(--accent-color)' : 'var(--text-secondary)')}`,
                  background: isAnswered && isThisCorrect ? 'var(--success)' : (isSelected && !isAnswered ? 'var(--accent-color)' : 'transparent'),
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: '700',
                  fontSize: '0.85rem',
                  color: (isAnswered && isThisCorrect) || (isSelected && !isAnswered) ? 'white' : 'inherit',
                  transition: 'all 0.2s ease'
                }}>
                  {isAnswered && isThisCorrect ? <Check size={16} strokeWidth={3} /> : 
                   isAnswered && isSelected && !isThisCorrect ? <X size={16} strokeWidth={3} /> : 
                   optionLetter}
                </div>
                <span style={{ lineHeight: '1.4' }}>{opt}</span>
              </div>
            
              {/* Feedback Section */}
              <AnimatePresence>
                {isAnswered && isThisCorrect && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden', width: '100%' }}
                  >
                    <div style={{
                      padding: '1rem 1.2rem',
                      borderTop: `1px solid ${borderColor}`,
                      background: 'rgba(16, 185, 129, 0.08)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '8px', 
                        fontWeight: 'bold', 
                        color: 'var(--success)' 
                      }}>
                        <CheckCircle size={18}/>
                        Esatto!
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                        {question.explanation}
                      </p>
                    </div>
                  </motion.div>
                )}
                {isAnswered && isSelected && !isThisCorrect && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: 'hidden', width: '100%' }}
                  >
                    <div style={{
                      padding: '1rem 1.2rem',
                      borderTop: `1px solid ${borderColor}`,
                      background: 'rgba(239, 68, 68, 0.08)',
                      color: 'var(--text-primary)',
                      fontSize: '0.95rem'
                    }}>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '8px', 
                        fontWeight: 'bold', 
                        color: 'var(--error)' 
                      }}>
                        <AlertCircle size={18}/>
                        Non corretto
                      </div>
                      <p style={{ margin: 0, lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                        La risposta corretta è: <strong style={{ color: 'var(--success)' }}>{question.options[correctIndex]}</strong>
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
