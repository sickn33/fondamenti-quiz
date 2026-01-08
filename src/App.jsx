import { useState } from 'react'
import './App.css'
import StartScreen from './components/StartScreen'
import QuizScreen from './components/QuizScreen'
import ResultsScreen from './components/ResultsScreen'
import { useQuiz } from './hooks/useQuiz'

function App() {
  const {
    status,
    questions,
    currentIndex,
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
    resetQuiz
  } = useQuiz();

  return (
    <>
      {status === 'start' && (
        <StartScreen onStart={startQuiz} />
      )}

      {status === 'quiz' && (
        <QuizScreen 
          questions={questions}
          currentIndex={currentIndex}
          answers={answers}
          flagged={flagged}
          timeRemaining={timeRemaining}
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onJump={jumpToQuestion}
          onAnswer={answerQuestion}
          onToggleFlag={toggleFlag}
          onSubmit={submitQuiz}
        />
      )}

      {status === 'result' && (
        <ResultsScreen 
          result={calculateScore()} 
          questions={questions}
          answers={answers}
          onRestart={resetQuiz}
        />
      )}
    </>
  )
}

export default App
