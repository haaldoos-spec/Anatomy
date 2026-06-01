'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { LockClosedIcon, CheckCircleIcon } from '@heroicons/react/24/solid';

interface DifficultySelectorProps {
  userLevel: number;
  onSelect: (level: number) => void;
}

export default function DifficultySelector({ userLevel, onSelect }: DifficultySelectorProps) {
  const { t } = useLanguage();
  const levels = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
        {t('quiz.difficulty_select')}
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {levels.map((level) => {
          const isLocked = level > userLevel;
          const isCompleted = level < userLevel;

          return (
            <button
              key={level}
              disabled={isLocked}
              onClick={() => onSelect(level)}
              className={`
                relative flex flex-col items-center justify-center p-6 rounded-xl border-2 transition-all duration-200
                ${isLocked 
                  ? 'bg-gray-50 border-gray-200 cursor-not-allowed opacity-60' 
                  : isCompleted
                    ? 'bg-green-50 border-green-200 hover:border-green-400 hover:shadow-md'
                    : 'bg-white border-blue-200 hover:border-blue-400 hover:shadow-md'
                }
              `}
            >
              <span className={`text-sm font-semibold mb-1 ${isLocked ? 'text-gray-400' : 'text-blue-600'}`}>
                {t('quiz.level')}
              </span>
              <span className={`text-3xl font-bold ${isLocked ? 'text-gray-400' : 'text-gray-900'}`}>
                {level}
              </span>
              
              {isLocked && (
                <div className="mt-2">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
              )}
              
              {isCompleted && (
                <div className="absolute top-2 right-2">
                  <CheckCircleIcon className="h-5 w-5 text-green-500" />
                </div>
              )}

              {isLocked && (
                <span className="absolute -bottom-10 left-0 right-0 text-[10px] text-gray-500 text-center hidden group-hover:block">
                  {t('quiz.reach_level').replace('{n}', level.toString())}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
