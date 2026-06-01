'use client';

import React, { useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { User, Mail, Shield, Zap, TrendingUp, LogOut, Settings } from 'lucide-react';
import Navbar from '@/components/Navbar';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, logout, refreshUser } = useAuth();

  useEffect(() => {
    refreshUser();
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="bg-white rounded-[40px] shadow-xl overflow-hidden border border-gray-100">
            {/* Header / Banner Area */}
            <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700"></div>
            
            <div className="px-8 pb-8">
              <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="flex items-end gap-6">
                  <div className="w-24 h-24 rounded-3xl bg-white p-1 shadow-lg">
                    <div className="w-full h-full rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 text-3xl font-black">
                      {user?.name ? getInitials(user.name) : <User className="w-12 h-12" />}
                    </div>
                  </div>
                  <div className="pb-1">
                    <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user?.name}</h1>
                    <div className="flex items-center gap-2 text-gray-500 font-medium">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={logout}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-all active:scale-95"
                >
                  <LogOut className="w-5 h-5" />
                  {t('nav.logout')}
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Subscription Card */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-100 p-2 rounded-xl text-indigo-600">
                        <Shield className="w-5 h-5" />
                      </div>
                      <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">{t('profile.subscription')}</h3>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                      user?.subscription_status === 'active' || user?.subscription_status === 'trialing'
                        ? 'bg-green-100 text-green-600'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {user?.subscription_status === 'active' || user?.subscription_status === 'trialing' ? t('profile.active') : t('profile.inactive')}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-2xl font-black text-gray-900 capitalize">
                        {user?.subscription_status === 'active' || user?.subscription_status === 'trialing' 
                          ? `${user?.subscription_plan || 'Premium'} Plan` 
                          : 'Free Plan'}
                      </p>
                      <p className="text-sm text-gray-500 font-medium mt-1">
                        {user?.subscription_status === 'active' || user?.subscription_status === 'trialing' 
                          ? 'Full access to all 3D models and AI tutor.'
                          : 'Upgrade for unlimited quizzes and AI tutor.'}
                      </p>
                    </div>
                    {!(user?.subscription_status === 'active' || user?.subscription_status === 'trialing') && (
                      <div className="bg-amber-100 p-3 rounded-2xl text-amber-600">
                        <Zap className="w-6 h-6 fill-current" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Progress Card */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-blue-100 p-2 rounded-xl text-blue-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">{t('profile.progress')}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-end">
                      <div>
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('profile.level')}</span>
                        <p className="text-3xl font-black text-gray-900">{user?.level || 1}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('profile.xp')}</span>
                        <p className="text-xl font-black text-blue-600">{user?.xp || 0} <span className="text-gray-300">/ 100</span></p>
                      </div>
                    </div>
                    
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-blue-600 h-3 rounded-full shadow-sm shadow-blue-200 transition-all duration-1000" 
                        style={{ width: `${user?.xp || 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Settings / Actions */}
              <div className="mt-10 pt-8 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="bg-gray-100 p-2 rounded-xl text-gray-600">
                    <Settings className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-gray-900 uppercase tracking-wider text-xs">{t('profile.manage')}</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <a 
                    href="/pricing"
                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group"
                  >
                    <span className="font-bold text-gray-700 group-hover:text-blue-700">Change Subscription Plan</span>
                    <Shield className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </a>
                  <button className="flex items-center justify-between p-4 rounded-2xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all group text-left">
                    <span className="font-bold text-gray-700 group-hover:text-blue-700">Account Settings</span>
                    <User className="w-5 h-5 text-gray-400 group-hover:text-blue-600" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
