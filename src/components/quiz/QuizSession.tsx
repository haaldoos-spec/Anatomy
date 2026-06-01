/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ClockIcon, 
  TrophyIcon,
  ChevronRightIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';
import api from '@/lib/api';

interface Question {
  id: string;
  question_en: string;
  question_sv: string;
  options_en: string; // JSON string
  options_sv: string; // JSON string
  correct_answer_en: string;
  correct_answer_sv: string;
  explanation_en: string;
  explanation_sv: string;
}

interface QuizSessionProps {
  level: number;
  onComplete: (stats: { score: number; total: number; xpGained: number; leveledUp: boolean }) => void;
}

export default function QuizSession({ level, onComplete }: QuizSessionProps) {
  const { language, t } = useLanguage();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [loading, setLoading] = useState(true);
  const [xpAnimation, setXpAnimation] = useState(false);

  const handleAnswer = useCallback(async (option: string | null) => {
    if (isAnswered) return;

    const currentQuestion = questions[currentIndex];
    if (!currentQuestion) return;

    const isCorrect = option === (language === 'en' ? currentQuestion.correct_answer_en : currentQuestion.correct_answer_sv);

    setSelectedOption(option);
    setIsAnswered(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setXpAnimation(true);
      setTimeout(() => setXpAnimation(false), 1000);
    } else {
      setStreak(0);
    }
  }, [isAnswered, questions, currentIndex, language]);

  const fetchQuestions = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get(`/quiz/questions?level=${level}&limit=10`);
      setQuestions(res.data);
    } catch (error) {
      console.error('Failed to fetch questions:', error);
    } finally {
      setLoading(false);
    }
  }, [level]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  useEffect(() => {
    if (loading || isAnswered || questions.length === 0) return;

    if (timeLeft === 0) {
      handleAnswer(null); // Time out
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, loading, isAnswered, questions.length, handleAnswer]);

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(30);
    } else {
      finishQuiz();
    }
  };

  const finishQuiz = async () => {
    try {
      const res = await api.post('/quiz/submit', {
        score,
        totalQuestions: questions.length
      });
      const data = res.data;
      
      if (data.leveledUp) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      onComplete({
        score,
        total: questions.length,
        xpGained: data.xpGained,
        leveledUp: data.leveledUp
      });
    } catch (error) {
      console.error('Failed to submit quiz:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <ArrowPathIcon className="h-12 w-12 text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">{t('quiz.loading_questions')}</p>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-12">
        <p className="text-red-500">No questions found for this level.</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          {t('quiz.try_again')}
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const options = JSON.parse(language === 'en' ? currentQuestion.options_en : currentQuestion.options_sv);
  const correctAnswer = language === 'en' ? currentQuestion.correct_answer_en : currentQuestion.correct_answer_sv;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header Info */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <div className="bg-blue-100 p-2 rounded-lg">
            <TrophyIcon className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">{t('quiz.streak')}</p>
            <p className="text-xl font-bold text-gray-900">{streak}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className={`p-2 rounded-lg transition-colors ${timeLeft < 10 ? 'bg-red-100' : 'bg-gray-100'}`}>
            <ClockIcon className={`h-6 w-6 ${timeLeft < 10 ? 'text-red-600' : 'text-gray-600'}`} />
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wider">Timer</p>
            <p className={`text-xl font-bold ${timeLeft < 10 ? 'text-red-600' : 'text-gray-900'}`}>{timeLeft}s</p>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-gray-600">
            {t('quiz.question')} {currentIndex + 1} {t('quiz.of')} {questions.length}
          </span>
          <span className="text-sm font-medium text-blue-600">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* XP Pop-up Animation */}
      <AnimatePresence>
        {xpAnimation && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: -40 }}
            exit={{ opacity: 0 }}
            className="absolute left-1/2 -translate-x-1/2 text-green-500 font-bold text-2xl z-10"
          >
            +10 XP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-8 leading-tight">
            {language === 'en' ? currentQuestion.question_en : currentQuestion.question_sv}
          </h3>

          <div className="space-y-4">
            {options.map((option: string, idx: number) => {
              const isSelected = selectedOption === option;
              const isCorrect = option === correctAnswer;
              const showCorrect = isAnswered && isCorrect;
              const showWrong = isAnswered && isSelected && !isCorrect;

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleAnswer(option)}
                  className={`
                    w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-200
                    ${!isAnswered 
                      ? 'border-gray-200 hover:border-blue-400 hover:bg-blue-50 text-gray-700' 
                      : showCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : showWrong
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : isSelected
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-100 bg-gray-50 text-gray-400'
                    }
                  `}
                >
                  <span className="text-lg font-medium">{option}</span>
                  {showCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                  {showWrong && <XCircleIcon className="h-6 w-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* Feedback & Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-100"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <span className={`font-bold ${selectedOption === correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
                    {selectedOption === correctAnswer ? t('quiz.correct') : t('quiz.incorrect')}
                  </span>
                </div>
                <p className="text-gray-600 leading-relaxed italic">
                  {language === 'en' ? currentQuestion.explanation_en : currentQuestion.explanation_sv}
                </p>
                
                <button
                  onClick={nextQuestion}
                  className="mt-6 w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  <span>{currentIndex < questions.length - 1 ? t('quiz.next') : t('quiz.finish')}</span>
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
