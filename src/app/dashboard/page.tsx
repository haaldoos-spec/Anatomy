'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useLanguage } from '@/context/LanguageContext';

export default function DashboardPage() {
  const { user } = useAuth();
  const { t } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-gray-900">{t('dashboard.welcome')}, {user?.name}!</h1>
        <p className="mt-2 text-gray-600">{t('dashboard.subtitle')}</p>
        
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Dashboard cards */}
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.recent_quizzes')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.no_quizzes')}</p>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.study_progress')}</h3>
              <div className="mt-4">
                <p className="text-sm text-gray-500">{t('dashboard.current_level')}: <span className="font-bold text-blue-600">{user?.level || 1}</span></p>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${user?.xp || 0}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-gray-400 text-right">{user?.xp || 0} / 100 XP</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg font-medium text-gray-900">{t('dashboard.pomodoro_sessions')}</h3>
              <p className="mt-1 text-sm text-gray-500">{t('dashboard.start_first_session')}</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
