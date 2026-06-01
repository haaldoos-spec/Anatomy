'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { motion } from 'framer-motion';
import { 
  TrophyIcon, 
  ArrowLeftIcon, 
  ArrowPathIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import Link from 'next/link';

interface QuizResultsProps {
  stats: {
    score: number;
    total: number;
    xpGained: number;
    leveledUp: boolean;
  };
  onRetry: () => void;
}

export default function QuizResults({ stats, onRetry }: QuizResultsProps) {
  const { t } = useLanguage();
  const percentage = Math.round((stats.score / stats.total) * 100);

  return (
    <div className="max-w-2xl mx-auto px-4 py-12 text-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl shadow-2xl p-12 border border-gray-100"
      >
        <div className="flex justify-center mb-8">
          <div className="relative">
            <TrophyIcon className="h-24 w-24 text-yellow-400" />
            {stats.leveledUp && (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute -top-4 -right-4"
              >
                <SparklesIcon className="h-12 w-12 text-blue-500 opacity-50" />
              </motion.div>
            )}
          </div>
        </div>

        <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
          {t('quiz.quiz_completed')}
        </h2>
        
        {stats.leveledUp && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block px-6 py-2 bg-green-100 text-green-700 rounded-full font-bold text-lg mb-8"
          >
            {t('quiz.level_up')} 🚀
          </motion.div>
        )}

        <div className="grid grid-cols-2 gap-8 mb-12">
          <div className="p-6 bg-blue-50 rounded-2xl">
            <p className="text-sm text-blue-600 uppercase font-bold tracking-widest mb-1">
              {t('quiz.your_score')}
            </p>
            <p className="text-3xl font-black text-blue-900">
              {stats.score} / {stats.total}
            </p>
            <p className="text-sm text-blue-400 font-medium">({percentage}%)</p>
          </div>
          
          <div className="p-6 bg-purple-50 rounded-2xl">
            <p className="text-sm text-purple-600 uppercase font-bold tracking-widest mb-1">
              {t('quiz.xp_gained')}
            </p>
            <p className="text-3xl font-black text-purple-900">
              +{stats.xpGained}
            </p>
            <p className="text-sm text-purple-400 font-medium">{t('quiz.xp')}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={onRetry}
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl transition-colors"
          >
            <ArrowPathIcon className="h-5 w-5" />
            <span>{t('quiz.try_again')}</span>
          </button>
          
          <Link
            href="/dashboard"
            className="flex-1 flex items-center justify-center space-x-2 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>{t('quiz.back_to_dashboard')}</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
