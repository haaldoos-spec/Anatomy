'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import DifficultySelector from '@/components/quiz/DifficultySelector';
import QuizSession from '@/components/quiz/QuizSession';
import QuizResults from '@/components/quiz/QuizResults';
import { useLanguage } from '@/context/LanguageContext';

import { useAuth } from '@/context/AuthContext';

type QuizState = 'selection' | 'active' | 'results';

export default function QuizPage() {
  const { t } = useLanguage();
  const { user, refreshUser } = useAuth();
  const [state, setState] = useState<QuizState>('selection');
  const [selectedLevel, setSelectedLevel] = useState(1);
  const [results, setResults] = useState<{ score: number; total: number; xpGained: number; leveledUp: boolean } | null>(null);

  const userLevel = user?.level || 1;

  const handleStartQuiz = (level: number) => {
    setSelectedLevel(level);
    setState('active');
  };

  const handleQuizComplete = (stats: { score: number; total: number; xpGained: number; leveledUp: boolean }) => {
    setResults(stats);
    setState('results');
    refreshUser();
  };

  const handleRetry = () => {
    setResults(null);
    setState('selection');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl">
              {t('quiz.title')}
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              {state === 'selection' ? t('landing.feature_quiz_desc') : `Level ${selectedLevel}`}
            </p>
          </div>

          {state === 'selection' && (
            <DifficultySelector 
              userLevel={userLevel} 
              onSelect={handleStartQuiz} 
            />
          )}

          {state === 'active' && (
            <QuizSession 
              level={selectedLevel} 
              onComplete={handleQuizComplete} 
            />
          )}

          {state === 'results' && results && (
            <QuizResults 
              stats={results} 
              onRetry={handleRetry} 
            />
          )}
        </div>
      </main>
    </div>
  );
}
