import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Timer from './Timer';
import QuestionCard from './QuestionCard';
import { ArrowLeft, ArrowRight, Flag, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';

export default function QuizScreen({ 
  questions, 
  currentIndex, 
  onNext, 
  onPrev, 
  onJump, 
  onAnswer, 
  answers, 
  timeRemaining, 
  onSubmit,
  flagged,
  onToggleFlag
}) {
  const [showNavigator, setShowNavigator] = useState(true);

  // Keyboard Navigation
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') {
        onNext();
      } else if (e.key === 'ArrowLeft') {
        onPrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNext, onPrev]);

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;
  const progress = (answeredCount / questions.length) * 100;
  const flaggedCount = flagged.size;

  return (
    <div style={{ width: '100%', maxWidth: '850px', margin: '0 auto' }} className="animate-fade-in">
      {/* Top Bar */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '1.5rem',
        padding: '0 5px'
      }}>
        <div>
          <span style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
            Domanda {currentIndex + 1}
          </span>
          <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', fontSize: '1.1rem' }}>
            / {questions.length}
          </span>
        </div>
        <Timer seconds={timeRemaining} />
      </div>

      {/* Progress Bar with Stats */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          marginBottom: '8px',
          fontSize: '0.85rem',
          color: 'var(--text-secondary)'
        }}>
          <span>Completamento: {answeredCount}/{questions.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ 
          height: '8px', 
          background: 'rgba(255,255,255,0.1)', 
          borderRadius: '4px', 
          overflow: 'hidden'
        }}>
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ 
              height: '100%', 
              background: 'linear-gradient(90deg, var(--accent-color), #8b5cf6)',
              borderRadius: '4px'
            }} 
          />
        </div>
      </div>

      {/* Question Card with Flag Button */}
      <div style={{ position: 'relative' }}>
        <motion.button 
          onClick={onToggleFlag}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          style={{
            position: 'absolute',
            top: '-45px',
            right: '0',
            background: flagged.has(currentQ.id) ? 'rgba(251, 191, 36, 0.15)' : 'rgba(255,255,255,0.05)',
            border: flagged.has(currentQ.id) ? '1px solid rgba(251, 191, 36, 0.3)' : '1px solid var(--card-border)',
            borderRadius: '10px',
            padding: '8px 14px',
            color: flagged.has(currentQ.id) ? '#fbbf24' : 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          <Flag size={16} fill={flagged.has(currentQ.id) ? '#fbbf24' : 'none'} />
          {flagged.has(currentQ.id) ? 'Segnalata' : 'Segnala'}
        </motion.button>

        <QuestionCard 
          question={currentQ} 
          selectedOption={answers[currentQ.id]} 
          onSelect={onAnswer} 
        />
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1.5rem', gap: '1rem' }}>
        <motion.button 
          className="btn-secondary" 
          onClick={onPrev}
          disabled={currentIndex === 0}
          whileHover={{ scale: currentIndex === 0 ? 1 : 1.02 }}
          whileTap={{ scale: currentIndex === 0 ? 1 : 0.98 }}
          style={{ 
            opacity: currentIndex === 0 ? 0.5 : 1,
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={20} />
          Precedente
        </motion.button>

        {currentIndex === questions.length - 1 ? (
          <motion.button 
            className="btn-primary" 
            onClick={onSubmit}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              background: 'linear-gradient(135deg, var(--success), #059669)', 
              boxShadow: '0 4px 20px rgba(16, 185, 129, 0.4)',
              flex: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Concludi Esame
            <CheckCircle size={20} />
          </motion.button>
        ) : (
          <motion.button 
            className="btn-primary" 
            onClick={onNext}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}
          >
            Successiva
            <ArrowRight size={20} />
          </motion.button>
        )}
      </div>

      {/* Collapsible Navigator */}
      <div style={{ marginTop: '2.5rem', borderTop: '1px solid var(--card-border)', paddingTop: '1.5rem' }}>
        <button 
          onClick={() => setShowNavigator(!showNavigator)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            padding: '0.5rem 0',
            cursor: 'pointer',
            fontSize: '0.95rem'
          }}
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontWeight: '600' }}>Navigatore</span>
            {flaggedCount > 0 && (
              <span style={{
                background: 'rgba(251, 191, 36, 0.2)',
                color: '#fbbf24',
                padding: '2px 8px',
                borderRadius: '10px',
                fontSize: '0.75rem',
                fontWeight: '600'
              }}>
                {flaggedCount} segnalat{flaggedCount === 1 ? 'a' : 'e'}
              </span>
            )}
          </span>
          {showNavigator ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </button>
        
        <motion.div
          initial={false}
          animate={{ height: showNavigator ? 'auto' : 0, opacity: showNavigator ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: 'hidden' }}
        >
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(42px, 1fr))', 
            gap: '8px',
            paddingTop: '1rem'
          }}>
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = idx === currentIndex;
              const isFlagged = flagged.has(q.id);
              
              let bg = 'rgba(255,255,255,0.05)';
              let borderColor = 'transparent';
              if (isCurrent) {
                bg = 'var(--text-primary)';
                borderColor = 'var(--accent-color)';
              } else if (isFlagged) {
                bg = 'rgba(251, 191, 36, 0.8)';
              } else if (isAnswered) {
                bg = 'var(--accent-color)';
              }
              
              let color = 'var(--text-secondary)';
              if (isCurrent) color = 'var(--bg-primary)';
              else if (isFlagged) color = 'black';
              else if (isAnswered) color = 'white';

              return (
                <motion.button
                  key={q.id}
                  onClick={() => onJump(idx)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    border: isCurrent ? `2px solid ${borderColor}` : 'none',
                    background: bg,
                    color: color,
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {idx + 1}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
