import { useState, useEffect, useCallback } from 'react';
import questionsData from '../data/questions.json';

const QUESTIONS_PER_QUIZ = 30;
const QUIZ_DURATION_SEC = 30 * 60; // 30 minutes

export function useQuiz() {
  const [status, setStatus] = useState('start'); // start, quiz, result
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: optionIndex }
  const [flagged, setFlagged] = useState(new Set());
  const [timeRemaining, setTimeRemaining] = useState(QUIZ_DURATION_SEC);

  // Initialize Quiz
  const startQuiz = useCallback((targetCount = 30) => {
    const allQuestions = questionsData.questions;
    setTimeRemaining(targetCount * 60); // 1 minute per question rule
    // Balanced Random Selection
    const byTopic = {
      "web": [],
      "database": [],
      "security": [],
      "ai": []
    };

    // Group questions
    allQuestions.forEach(q => {
      const t = q.topic.toLowerCase();
      if (t.includes('web')) byTopic.web.push(q);
      else if (t.includes('database')) byTopic.database.push(q);
      else if (t.includes('sicurezza') || t.includes('security')) byTopic.security.push(q);
      else byTopic.ai.push(q);
    });

    const getRandom = (list, count) => {
      const shuffled = [...list].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, count);
    };

    // Target ratios: Web 26%, DB 26%, Security 23%, AI 25% (Total 100%)
    const targetWeb = Math.round(targetCount * 0.26);
    const targetDatabase = Math.round(targetCount * 0.26);
    const targetSecurity = Math.round(targetCount * 0.23);
    const targetAI = targetCount - (targetWeb + targetDatabase + targetSecurity); // Remainder

    const selected = [
      ...getRandom(byTopic.web, targetWeb),
      ...getRandom(byTopic.database, targetDatabase),
      ...getRandom(byTopic.security, targetSecurity),
      ...getRandom(byTopic.ai, targetAI)
    ];

    // Shuffle the final mix
    const finalQuestions = selected.sort(() => 0.5 - Math.random());
    
    setQuestions(finalQuestions);
    setCurrentIndex(0);
    setAnswers({});
    setFlagged(new Set());
    setTimeRemaining(QUIZ_DURATION_SEC);
    setStatus('quiz');
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (status === 'quiz' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setStatus('result');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status, timeRemaining]);

  const answerQuestion = (optionIndex) => {
    const currentQ = questions[currentIndex];
    setAnswers(prev => ({
      ...prev,
      [currentQ.id]: optionIndex
    }));
  };

  const toggleFlag = () => {
    const currentQ = questions[currentIndex];
    setFlagged(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQ.id)) newSet.delete(currentQ.id);
      else newSet.add(currentQ.id);
      return newSet;
    });
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const jumpToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  const submitQuiz = () => {
    setStatus('result');
  };

  // Calculate stats
  const calculateScore = () => {
    let score = 0;
    let correctCount = 0;
    questions.forEach(q => {
      if (answers[q.id] === q.correct) {
        score += 1; // 1 point per correct? Or 30/30
        correctCount++;
      }
    });
    return { score, correctCount, total: questions.length };
  };

  return {
    status,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex],
    answers,
    flagged,
    timeRemaining,
    startQuiz,
    answerQuestion,
    toggleFlag,
    nextQuestion,
    prevQuestion,
    jumpToQuestion,
    submitQuiz,
    calculateScore,
    resetQuiz: () => setStatus('start')
  };
}
