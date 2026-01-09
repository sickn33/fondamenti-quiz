import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, BookOpen, Clock, Sparkles, Layers, Shield, Database, Globe, Brain, Zap, Trophy, Target, ChevronRight, Star } from 'lucide-react';
import questionsData from '../data/questions.json';

export default function StartScreen({ onStart }) {
  const [questionCount, setQuestionCount] = useState(30);
  const [hoveredCard, setHoveredCard] = useState(null);
  
  // Get real question counts from data
  const stats = useMemo(() => {
    const all = questionsData.questions;
    const byTopic = { web: 0, database: 0, security: 0, ai: 0 };
    
    all.forEach(q => {
      const t = q.topic.toLowerCase();
      if (t.includes('web')) byTopic.web++;
      else if (t.includes('database')) byTopic.database++;
      else if (t.includes('sicurezza') || t.includes('security')) byTopic.security++;
      else byTopic.ai++;
    });
    
    return { total: all.length, ...byTopic };
  }, []);

  // Animated counter
  const [displayCount, setDisplayCount] = useState(0);
  useEffect(() => {
    const duration = 1500;
    const steps = 60;
    const increment = stats.total / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= stats.total) {
        setDisplayCount(stats.total);
        clearInterval(timer);
      } else {
        setDisplayCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [stats.total]);

  const topicData = [
    { key: 'web', icon: Globe, label: 'Tecnologie Web', count: stats.web, color: '#3b82f6', gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' },
    { key: 'database', icon: Database, label: 'Database', count: stats.database, color: '#10b981', gradient: 'linear-gradient(135deg, #10b981, #059669)' },
    { key: 'security', icon: Shield, label: 'Sicurezza', count: stats.security, color: '#ef4444', gradient: 'linear-gradient(135deg, #ef4444, #dc2626)' },
    { key: 'ai', icon: Brain, label: 'Intelligenza Artificiale', count: stats.ai, color: '#8b5cf6', gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)' },
  ];

  return (
    <div className="start-screen-container">
      {/* Animated Background Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="start-screen-card"
      >
        {/* Glowing Header Badge */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
          className="hero-badge"
        >
          <div className="hero-badge-inner">
            <Sparkles size={32} color="white" />
          </div>
          <div className="hero-badge-ring" />
          <div className="hero-badge-ring hero-badge-ring-2" />
        </motion.div>

        {/* Title */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="hero-title"
        >
          Fondamenti Quiz
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="hero-subtitle"
        >
          Simulazione Esame • Tecnologia per la Comunicazione
        </motion.p>

        {/* Main Stats Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="main-stats-card"
        >
          <div className="stat-highlight">
            <div className="stat-number">{displayCount}</div>
            <div className="stat-label">Domande nel Database</div>
          </div>
          <div className="stat-divider" />
          <div className="stat-features">
            <div className="feature-item">
              <Zap size={16} className="feature-icon" />
              <span>Mix Bilanciato</span>
            </div>
            <div className="feature-item">
              <Target size={16} className="feature-icon" />
              <span>Domande Uniche</span>
            </div>
            <div className="feature-item">
              <Trophy size={16} className="feature-icon" />
              <span>Risultati Dettagliati</span>
            </div>
          </div>
        </motion.div>

        {/* Topic Cards Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="topics-grid"
        >
          {topicData.map((topic, idx) => (
            <motion.div
              key={topic.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + idx * 0.1 }}
              whileHover={{ scale: 1.03, y: -5 }}
              onHoverStart={() => setHoveredCard(topic.key)}
              onHoverEnd={() => setHoveredCard(null)}
              className="topic-card"
              style={{ '--topic-color': topic.color, '--topic-gradient': topic.gradient }}
            >
              <div className="topic-icon-wrapper">
                <topic.icon size={20} />
              </div>
              <div className="topic-info">
                <span className="topic-label">{topic.label}</span>
                <span className="topic-count">{topic.count} domande</span>
              </div>
              <AnimatePresence>
                {hoveredCard === topic.key && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="topic-glow"
                  />
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>

        {/* Question Count Selector */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="question-selector"
        >
          <label className="selector-label">
            <Star size={14} />
            Numero di Domande
          </label>
          <div className="selector-buttons">
            {[30, 50, 70, 100].map((count, idx) => (
              <motion.button
                key={count}
                onClick={() => setQuestionCount(count)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`selector-btn ${questionCount === count ? 'active' : ''}`}
              >
                <span className="btn-count">{count}</span>
                <span className="btn-time">{count} min</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Start Button */}
        <motion.button 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="start-button" 
          onClick={() => onStart(questionCount)} 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="start-button-bg" />
          <span className="start-button-content">
            <Play size={22} fill="white" />
            INIZIA SIMULAZIONE
            <ChevronRight size={20} className="chevron-icon" />
          </span>
        </motion.button>

        {/* Keyboard hint */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.1 }}
          className="keyboard-hint"
        >
          <kbd>←</kbd> <kbd>→</kbd> per navigare • <kbd>1-4</kbd> per rispondere veloce
        </motion.p>
      </motion.div>
      
      <style>{`
        .start-screen-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          padding: 2rem;
          position: relative;
          overflow: hidden;
        }
        
        .orb {
          position: fixed;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.5;
          pointer-events: none;
          z-index: -1;
        }
        
        .orb-1 {
          width: 400px;
          height: 400px;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          top: -100px;
          left: -100px;
          animation: float1 15s ease-in-out infinite;
        }
        
        .orb-2 {
          width: 350px;
          height: 350px;
          background: linear-gradient(135deg, #10b981, #3b82f6);
          bottom: -50px;
          right: -100px;
          animation: float2 18s ease-in-out infinite;
        }
        
        .orb-3 {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, #ef4444, #f59e0b);
          top: 50%;
          left: 50%;
          animation: float3 12s ease-in-out infinite;
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, 50px) scale(1.1); }
          66% { transform: translate(-30px, 30px) scale(0.95); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-40px, -40px) scale(1.05); }
          66% { transform: translate(30px, -20px) scale(0.9); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.2); }
        }
        
        .start-screen-card {
          background: rgba(15, 23, 42, 0.8);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 32px;
          padding: 3rem;
          max-width: 700px;
          width: 100%;
          text-align: center;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 20px 40px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .hero-badge {
          width: 90px;
          height: 90px;
          margin: 0 auto 1.5rem;
          position: relative;
        }
        
        .hero-badge-inner {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 40px rgba(59, 130, 246, 0.5);
          position: relative;
          z-index: 2;
        }
        
        .hero-badge-ring {
          position: absolute;
          inset: -10px;
          border: 2px solid rgba(59, 130, 246, 0.3);
          border-radius: 50%;
          animation: ringPulse 2s ease-in-out infinite;
        }
        
        .hero-badge-ring-2 {
          inset: -20px;
          animation-delay: 0.5s;
          border-color: rgba(139, 92, 246, 0.2);
        }
        
        @keyframes ringPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
        
        .hero-title {
          font-size: 3.2rem;
          font-weight: 800;
          background: linear-gradient(135deg, #ffffff 0%, #94a3b8 50%, #ffffff 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 0.5rem;
          letter-spacing: -0.03em;
          animation: shimmer 3s ease-in-out infinite;
        }
        
        @keyframes shimmer {
          0% { background-position: 0% center; }
          100% { background-position: 200% center; }
        }
        
        .hero-subtitle {
          font-size: 1.1rem;
          color: #94a3b8;
          margin: 0 0 2rem;
          letter-spacing: 0.05em;
        }
        
        .main-stats-card {
          background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1));
          border: 1px solid rgba(59, 130, 246, 0.2);
          border-radius: 20px;
          padding: 1.5rem 2rem;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1.5rem;
        }
        
        .stat-highlight {
          flex-shrink: 0;
        }
        
        .stat-number {
          font-size: 3rem;
          font-weight: 800;
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }
        
        .stat-label {
          font-size: 0.85rem;
          color: #94a3b8;
          margin-top: 4px;
        }
        
        .stat-divider {
          width: 1px;
          height: 60px;
          background: linear-gradient(to bottom, transparent, rgba(255,255,255,0.2), transparent);
        }
        
        .stat-features {
          display: flex;
          flex-direction: column;
          gap: 8px;
          text-align: left;
        }
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #cbd5e1;
        }
        
        .feature-icon {
          color: #3b82f6;
        }
        
        .topics-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 1.5rem;
        }
        
        .topic-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          padding: 1rem;
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: default;
          position: relative;
          overflow: hidden;
          transition: border-color 0.3s, background 0.3s;
        }
        
        .topic-card:hover {
          border-color: var(--topic-color);
          background: rgba(255, 255, 255, 0.05);
        }
        
        .topic-icon-wrapper {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--topic-gradient);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          flex-shrink: 0;
        }
        
        .topic-info {
          display: flex;
          flex-direction: column;
          text-align: left;
        }
        
        .topic-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: #f1f5f9;
        }
        
        .topic-count {
          font-size: 0.75rem;
          color: var(--topic-color);
          font-weight: 500;
        }
        
        .topic-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at center, var(--topic-color), transparent 70%);
          opacity: 0.1;
          pointer-events: none;
        }
        
        .question-selector {
          margin-bottom: 1.5rem;
        }
        
        .selector-label {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.85rem;
          color: #94a3b8;
          margin-bottom: 12px;
          font-weight: 500;
        }
        
        .selector-buttons {
          display: flex;
          gap: 10px;
        }
        
        .selector-btn {
          flex: 1;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 14px;
          padding: 1rem 0.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .selector-btn .btn-count {
          font-size: 1.3rem;
          font-weight: 700;
          color: #94a3b8;
        }
        
        .selector-btn .btn-time {
          font-size: 0.7rem;
          color: #64748b;
        }
        
        .selector-btn.active {
          background: rgba(59, 130, 246, 0.15);
          border-color: #3b82f6;
        }
        
        .selector-btn.active .btn-count {
          color: #3b82f6;
        }
        
        .selector-btn.active .btn-time {
          color: #60a5fa;
        }
        
        .selector-btn:hover:not(.active) {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.2);
        }
        
        .start-button {
          width: 100%;
          position: relative;
          border: none;
          border-radius: 16px;
          padding: 1.25rem 2rem;
          font-size: 1.15rem;
          font-weight: 700;
          color: white;
          cursor: pointer;
          overflow: hidden;
          background: transparent;
        }
        
        .start-button-bg {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          transition: transform 0.3s;
        }
        
        .start-button:hover .start-button-bg {
          transform: scale(1.02);
        }
        
        .start-button::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
          transform: translateX(-100%);
          transition: transform 0.5s;
        }
        
        .start-button:hover::before {
          transform: translateX(100%);
        }
        
        .start-button-content {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
        }
        
        .chevron-icon {
          transition: transform 0.3s;
        }
        
        .start-button:hover .chevron-icon {
          transform: translateX(4px);
        }
        
        .keyboard-hint {
          margin-top: 1.5rem;
          font-size: 0.8rem;
          color: #64748b;
        }
        
        .keyboard-hint kbd {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 6px;
          padding: 3px 8px;
          font-family: inherit;
          font-size: 0.75rem;
        }
        
        @media (max-width: 640px) {
          .start-screen-card {
            padding: 2rem 1.5rem;
            border-radius: 24px;
          }
          
          .hero-title {
            font-size: 2.2rem;
          }
          
          .hero-subtitle {
            font-size: 0.95rem;
          }
          
          .main-stats-card {
            flex-direction: column;
            text-align: center;
            gap: 1rem;
          }
          
          .stat-divider {
            width: 60px;
            height: 1px;
            background: linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent);
          }
          
          .stat-features {
            align-items: center;
            text-align: center;
          }
          
          .topics-grid {
            grid-template-columns: 1fr;
          }
          
          .topic-card {
            padding: 0.875rem;
          }
          
          .selector-buttons {
            flex-wrap: wrap;
          }
          
          .selector-btn {
            min-width: calc(50% - 5px);
          }
        }
      `}</style>
    </div>
  );
}
