import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, RefreshCw, Trophy, Target, Award, Globe, Database, Shield, Brain } from 'lucide-react';

const TOPIC_CONFIG = {
  web: { icon: Globe, color: 'var(--topic-web)', label: 'Web' },
  database: { icon: Database, color: 'var(--topic-database)', label: 'Database' },
  security: { icon: Shield, color: 'var(--topic-security)', label: 'Security' },
  ai: { icon: Brain, color: 'var(--topic-ai)', label: 'AI' }
};

export default function ResultsScreen({ result, questions, answers, onRestart }) {
  const { score, correctCount, total } = result;
  const percentage = Math.round((correctCount / total) * 100);
  const [displayScore, setDisplayScore] = useState(0);
  const [filter, setFilter] = useState('all'); // all, correct, incorrect
  
  // Animated score counter
  useEffect(() => {
    let current = 0;
    const target = score;
    const duration = 1500;
    const step = (target / duration) * 16;
    
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.floor(current));
      }
    }, 16);
    
    return () => clearInterval(timer);
  }, [score]);

  // Calculate topic breakdown
  const topicStats = {};
  questions.forEach(q => {
    if (!topicStats[q.topic]) {
      topicStats[q.topic] = { correct: 0, total: 0 };
    }
    topicStats[q.topic].total++;
    if (answers[q.id] === q.correct) {
      topicStats[q.topic].correct++;
    }
  });

  // Grade logic
  let grade = "Insufficiente";
  let color = "var(--error)";
  let GradeIcon = XCircle;
  if (percentage >= 60) {
    grade = "Superato";
    color = "var(--success)";
    GradeIcon = Trophy;
  }
  if (percentage >= 85) {
    grade = "Eccellente";
    GradeIcon = Award;
  }

  // Filter questions
  const filteredQuestions = questions.filter(q => {
    const isCorrect = answers[q.id] === q.correct;
    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isCorrect;
    return true;
  });

  return (
    <div className="container-center animate-fade-in" style={{ paddingBottom: '3rem' }}>
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-panel"
        style={{ maxWidth: '900px', width: '100%' }}
      >
        {/* Header with Grade */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${color}, ${color}cc)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: `0 10px 40px ${color}40`
          }}
        >
          <GradeIcon size={42} color="white" />
        </motion.div>

        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Risultato Esame</h1>
        
        {/* Animated Score */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{ 
            fontSize: '5rem', 
            fontWeight: '800', 
            color: color,
            textShadow: `0 0 40px ${color}50`,
            marginBottom: '0.5rem',
            fontVariantNumeric: 'tabular-nums'
          }}
        >
          {displayScore}/{total}
        </motion.div>
        
        <div style={{ 
          fontSize: '1.5rem', 
          fontWeight: '600', 
          color: color, 
          marginBottom: '2rem',
          textTransform: 'uppercase',
          letterSpacing: '3px'
        }}>
          {grade} ({percentage}%)
        </div>

        {/* Topic Breakdown */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', 
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          {Object.entries(topicStats).map(([topic, stats]) => {
            const config = TOPIC_CONFIG[topic];
            const TopicIcon = config?.icon || Target;
            const topicPercentage = Math.round((stats.correct / stats.total) * 100);
            
            return (
              <motion.div
                key={topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  padding: '1.2rem',
                  borderRadius: '14px',
                  borderLeft: `4px solid ${config?.color || 'var(--accent-color)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <TopicIcon size={18} color={config?.color || 'var(--accent-color)'} />
                  <span style={{ fontWeight: '600', textTransform: 'capitalize' }}>{config?.label || topic}</span>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: '700', color: config?.color }}>
                  {stats.correct}/{stats.total}
                </div>
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: topicPercentage >= 60 ? 'var(--success)' : 'var(--error)' 
                }}>
                  {topicPercentage}% corretto
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Restart Button */}
        <motion.button 
          className="btn-primary" 
          onClick={onRestart} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            marginBottom: '3rem', 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '10px',
            padding: '1.1rem 2.5rem'
          }}
        >
          <RefreshCw size={20} />
          Nuova Simulazione
        </motion.button>

        {/* Review Filter */}
        <div style={{ 
          display: 'flex', 
          gap: '10px', 
          justifyContent: 'center',
          marginBottom: '1.5rem',
          flexWrap: 'wrap'
        }}>
          {[
            { key: 'all', label: `Tutte (${questions.length})` },
            { key: 'correct', label: `Corrette (${correctCount})`, color: 'var(--success)' },
            { key: 'incorrect', label: `Sbagliate (${total - correctCount})`, color: 'var(--error)' }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: '8px 16px',
                borderRadius: '10px',
                border: filter === f.key ? `2px solid ${f.color || 'var(--accent-color)'}` : '1px solid var(--card-border)',
                background: filter === f.key ? `${f.color || 'var(--accent-color)'}15` : 'rgba(255,255,255,0.03)',
                color: filter === f.key ? (f.color || 'white') : 'var(--text-secondary)',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '0.9rem'
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <h3 style={{ 
          textAlign: 'left', 
          marginBottom: '1.5rem', 
          borderBottom: '1px solid var(--card-border)', 
          paddingBottom: '0.5rem' 
        }}>
          Revisione Risposte
        </h3>

        {/* Questions Review */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredQuestions.map((q, idx) => {
            const userAnswer = answers[q.id];
            const isCorrect = userAnswer === q.correct;
            const isSkipped = userAnswer === undefined;
            const config = TOPIC_CONFIG[q.topic];
            const TopicIcon = config?.icon || Target;

            return (
              <motion.div 
                key={q.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                style={{ 
                  textAlign: 'left', 
                  background: 'rgba(255,255,255,0.03)', 
                  padding: '1.5rem', 
                  borderRadius: '16px',
                  borderLeft: `4px solid ${isCorrect ? 'var(--success)' : 'var(--error)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.5rem' }}>
                  <div style={{ 
                    color: isCorrect ? 'var(--success)' : 'var(--error)', 
                    marginTop: '2px',
                    background: isCorrect ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    padding: '8px',
                    borderRadius: '8px'
                  }}>
                    {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        textTransform: 'uppercase', 
                        color: 'var(--text-secondary)',
                        background: 'rgba(255,255,255,0.05)',
                        padding: '3px 8px',
                        borderRadius: '6px'
                      }}>
                        #{questions.indexOf(q) + 1}
                      </span>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '4px',
                        color: config?.color || 'var(--accent-color)',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        <TopicIcon size={14} />
                        {config?.label || q.topic}
                      </div>
                    </div>
                    <strong style={{ fontSize: '1.05rem', lineHeight: '1.4' }}>{q.question}</strong>
                  </div>
                </div>

                <div style={{ marginLeft: '52px', marginTop: '1rem', fontSize: '0.95rem' }}>
                  {!isCorrect && !isSkipped && (
                    <div style={{ color: 'var(--error)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <XCircle size={14} />
                      <span style={{ opacity: 0.8 }}>La tua risposta:</span> 
                      <span style={{ fontWeight: '500' }}>{q.options[userAnswer]}</span>
                    </div>
                  )}
                  {isSkipped && (
                    <div style={{ color: 'var(--text-secondary)', marginBottom: '6px', fontStyle: 'italic' }}>
                      ⚠️ Risposta non data
                    </div>
                  )}
                  <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={14} />
                    <span style={{ opacity: 0.8 }}>Corretta:</span> 
                    <span style={{ fontWeight: '500' }}>{q.options[q.correct]}</span>
                  </div>
                  
                  {q.explanation && (
                    <div style={{ 
                      marginTop: '1rem', 
                      padding: '1rem', 
                      background: 'rgba(59, 130, 246, 0.08)', 
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      color: '#93c5fd',
                      borderLeft: '3px solid var(--accent-color)'
                    }}>
                      <strong style={{ display: 'block', marginBottom: '6px' }}>💡 Spiegazione</strong>
                      {q.explanation}
                      <div style={{ fontSize: '0.75rem', marginTop: '8px', opacity: 0.6 }}>
                        📄 {q.slide_ref}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
