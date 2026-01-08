import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Clock, Sparkles, Layers, Shield, Database, Globe, Brain } from 'lucide-react';

export default function StartScreen({ onStart }) {
  const [questionCount, setQuestionCount] = useState(30);

  return (
    <div className="container-center animate-fade-in">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass-panel"
        style={{ maxWidth: '650px', width: '100%' }}
      >
        {/* Header with animated icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-color), #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem',
            boxShadow: '0 10px 40px rgba(59, 130, 246, 0.4)'
          }}
        >
          <Sparkles size={36} color="white" />
        </motion.div>

        <h1>Fondamenti Quiz</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-secondary)', marginBottom: '2.5rem' }}>
          Simulazione esame Tecnologia per la Comunicazione
        </p>

        {/* Stats Grid with Topic Icons */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '1rem', 
          marginBottom: '2rem', 
          textAlign: 'left' 
        }}>
          <InfoCard icon={<Clock />} title="Tempo" value={`${questionCount} Minuti`} color="var(--accent-color)" />
          <InfoCard icon={<BookOpen />} title="Database" value="400 Quesiti" color="var(--topic-database)" />
          <InfoCard icon={<Layers />} title="Topics" value="4 Argomenti" color="var(--topic-ai)" />
          <InfoCard icon={<Play />} title="Modalità" value="Mix Bilanciato" color="var(--topic-security)" />
        </div>

        {/* Topic Colors Legend */}
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: '10px', 
          justifyContent: 'center', 
          marginBottom: '2rem' 
        }}>
          <TopicBadge icon={<Globe size={12} />} label="Web" color="var(--topic-web)" />
          <TopicBadge icon={<Database size={12} />} label="Database" color="var(--topic-database)" />
          <TopicBadge icon={<Shield size={12} />} label="Security" color="var(--topic-security)" />
          <TopicBadge icon={<Brain size={12} />} label="AI" color="var(--topic-ai)" />
        </div>

        {/* Question Count Selector */}
        <div style={{ marginBottom: '2rem', textAlign: 'left' }}>
          <label style={{ 
            display: 'block', 
            color: 'var(--text-secondary)', 
            marginBottom: '12px', 
            fontSize: '0.9rem',
            fontWeight: '500'
          }}>
            Numero di Domande:
          </label>
          <div style={{ display: 'flex', gap: '10px' }}>
            {[30, 50, 70, 100].map(count => (
              <motion.button
                key={count}
                onClick={() => setQuestionCount(count)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  flex: 1,
                  padding: '1rem',
                  borderRadius: '12px',
                  border: questionCount === count 
                    ? '2px solid var(--accent-color)' 
                    : '1px solid var(--card-border)',
                  background: questionCount === count 
                    ? 'rgba(59, 130, 246, 0.15)' 
                    : 'rgba(255,255,255,0.03)',
                  color: questionCount === count ? 'white' : 'var(--text-secondary)',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  cursor: 'pointer'
                }}
              >
                {count}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <motion.button 
          className="btn-primary" 
          onClick={() => onStart(questionCount)} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{ 
            width: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '12px',
            fontSize: '1.2rem',
            padding: '1.2rem 2rem'
          }}
        >
          <Play size={24} fill="white" />
          INIZIA SIMULAZIONE
        </motion.button>

        <p style={{ 
          marginTop: '1.5rem', 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)',
          opacity: 0.7
        }}>
          💡 Usa ← → per navigare tra le domande
        </p>
      </motion.div>
    </div>
  );
}

function InfoCard({ icon, title, value, color }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02, background: 'rgba(255,255,255,0.06)' }}
      style={{ 
        background: 'rgba(255,255,255,0.03)', 
        padding: '1.2rem', 
        borderRadius: '14px', 
        display: 'flex', 
        alignItems: 'center', 
        gap: '14px',
        cursor: 'default',
        transition: 'background 0.2s'
      }}
    >
      <div style={{ 
        color: color,
        background: `${color}15`,
        padding: '10px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>{title}</div>
        <div style={{ fontWeight: '600', fontSize: '1.05rem' }}>{value}</div>
      </div>
    </motion.div>
  );
}

function TopicBadge({ icon, label, color }) {
  return (
    <div style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '600',
      background: `${color}15`,
      color: color,
      border: `1px solid ${color}30`
    }}>
      {icon}
      {label}
    </div>
  );
}
