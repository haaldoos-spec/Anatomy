'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircleIcon, XCircleIcon, ClockIcon } from '@heroicons/react/24/outline';

interface Question {
  id: string;
  question_en: string;
  question_sv: string;
  options_en: string;
  options_sv: string;
  correct_answer_en: string;
  correct_answer_sv: string;
  explanation_en: string;
  explanation_sv: string;
}

interface ChallengeQuizProps {
  questions: Question[];
  onFinish: (score: number) => void;
  onProgress: (score: number) => void;
}

export default function ChallengeQuiz({ questions, onFinish, onProgress }: ChallengeQuizProps) {
  const { language, t } = useLanguage();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20); // Shorter for challenges

  const handleAnswer = useCallback((option: string | null) => {
    if (isAnswered) return;

    const currentQuestion = questions[currentIndex];
    const isCorrect = option === (language === 'en' ? currentQuestion.correct_answer_en : currentQuestion.correct_answer_sv);

    setSelectedOption(option);
    setIsAnswered(true);

    if (isCorrect) {
      const newScore = score + 1;
      setScore(newScore);
      onProgress(newScore);
    }

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswered(false);
        setTimeLeft(20);
      } else {
        onFinish(isCorrect ? score + 1 : score);
      }
    }, 2000);
  }, [isAnswered, questions, currentIndex, language, score, onFinish, onProgress]);

  useEffect(() => {
    if (isAnswered) return;
    if (timeLeft === 0) {
      handleAnswer(null);
      return;
    }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, handleAnswer]);

  const currentQuestion = questions[currentIndex];
  const options = JSON.parse(language === 'en' ? currentQuestion.options_en : currentQuestion.options_sv);
  const correctAnswer = language === 'en' ? currentQuestion.correct_answer_en : currentQuestion.correct_answer_sv;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-sm font-black text-gray-400 uppercase tracking-widest">
           {t('quiz.question')} {currentIndex + 1} / {questions.length}
        </div>
        <div className={`flex items-center gap-2 font-black ${timeLeft < 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
           <ClockIcon className="w-5 h-5" />
           {timeLeft}s
        </div>
      </div>

      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
         <motion.div 
          className="h-full bg-blue-600"
          initial={{ width: 0 }}
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
         />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <h3 className="text-2xl font-black text-gray-900 mb-8 leading-tight">
            {language === 'en' ? currentQuestion.question_en : currentQuestion.question_sv}
          </h3>

          <div className="grid grid-cols-1 gap-4">
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
                    w-full flex items-center justify-between p-5 rounded-2xl border-2 transition-all duration-200
                    ${!isAnswered 
                      ? 'border-gray-100 bg-white hover:border-blue-500 hover:bg-blue-50 text-gray-700' 
                      : showCorrect
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : showWrong
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-50 bg-gray-50 text-gray-300'
                    }
                  `}
                >
                  <span className="text-lg font-bold">{option}</span>
                  {showCorrect && <CheckCircleIcon className="h-6 w-6 text-green-500" />}
                  {showWrong && <XCircleIcon className="h-6 w-6 text-red-500" />}
                </button>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
