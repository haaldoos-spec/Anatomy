/* eslint-disable react-hooks/set-state-in-effect */
'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useLanguage } from '@/context/LanguageContext';
import { Play, Pause, RotateCcw, Clock, Trophy, Coffee, Brain } from 'lucide-react';
import api from '@/lib/api';
import confetti from 'canvas-confetti';

const DURATIONS = {
  FOCUS: 25 * 60,
  SHORT_BREAK: 5 * 60,
  LONG_BREAK: 15 * 60,
};

type TimerMode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

export default function PomodoroPage() {
  const { t } = useLanguage();
  const [mode, setMode] = useState<TimerMode>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(DURATIONS.FOCUS);
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({ 
    today: { sessions: 0, minutes: 0 }, 
    week: { sessions: 0, minutes: 0 } 
  });
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const response = await api.get('/pomodoro/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch pomodoro stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    // Preload a notification sound if possible, or use a dummy
    // audioRef.current = new Audio('/sounds/notification.mp3');
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchStats]);

  const handleTimerComplete = useCallback(async () => {
    setIsActive(false);
    
    // Play sound (fallback to a simple beep if no file)
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const context = new AudioContextClass();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.connect(gain);
      gain.connect(context.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, context.currentTime);
      gain.gain.setValueAtTime(0.5, context.currentTime);
      oscillator.start();
      oscillator.stop(context.currentTime + 0.5);
    } catch (e) {
      console.error('Audio beep failed', e);
    }

    if (mode === 'FOCUS') {
      // Trigger confetti
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#f59e0b']
      });

      // Log session
      try {
        await api.post('/pomodoro/sessions', { duration_minutes: 25 });
        fetchStats();
      } catch (error) {
        console.error('Failed to log session:', error);
      }
      
      alert(t('pomodoro.session_complete'));
      setMode('SHORT_BREAK');
      setTimeLeft(DURATIONS.SHORT_BREAK);
    } else {
      alert(t('pomodoro.focus_time'));
      setMode('FOCUS');
      setTimeLeft(DURATIONS.FOCUS);
    }
  }, [mode, fetchStats, t]);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(DURATIONS[mode]);
  };

  const changeMode = (newMode: TimerMode) => {
    setIsActive(false);
    setMode(newMode);
    setTimeLeft(DURATIONS[newMode]);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Progress Circle Logic
  const totalTime = DURATIONS[mode];
  const progress = ((totalTime - timeLeft) / totalTime) * 100;
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  const getModeColor = () => {
    switch (mode) {
      case 'FOCUS': return 'text-blue-600 stroke-blue-600';
      case 'SHORT_BREAK': return 'text-green-500 stroke-green-500';
      case 'LONG_BREAK': return 'text-indigo-500 stroke-indigo-500';
      default: return 'text-blue-600 stroke-blue-600';
    }
  };

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
          
          {/* Main Timer Section */}
          <div className="flex-1 w-full max-w-2xl">
            <div className="bg-white rounded-[40px] shadow-2xl border border-gray-100 p-8 md:p-12 text-center relative overflow-hidden">
              {/* Mode Toggle */}
              <div className="flex justify-center gap-2 mb-10 bg-gray-100 p-1.5 rounded-2xl w-fit mx-auto">
                <button 
                  onClick={() => changeMode('FOCUS')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'FOCUS' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t('pomodoro.focus_time')}
                </button>
                <button 
                  onClick={() => changeMode('SHORT_BREAK')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'SHORT_BREAK' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t('pomodoro.short_break')}
                </button>
                <button 
                  onClick={() => changeMode('LONG_BREAK')}
                  className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'LONG_BREAK' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  {t('pomodoro.long_break')}
                </button>
              </div>

              {/* Timer Display with Progress Ring */}
              <div className="relative inline-flex items-center justify-center mb-10">
                <svg className="w-64 h-64 md:w-80 md:h-84 transform -rotate-90">
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="8"
                    className="text-gray-100"
                  />
                  <circle
                    cx="50%"
                    cy="50%"
                    r={radius}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    style={{ strokeDashoffset: offset }}
                    strokeLinecap="round"
                    className={`transition-all duration-500 ${getModeColor().split(' ')[1]}`}
                  />
                </svg>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl md:text-7xl font-mono font-black text-gray-900 tracking-tighter">
                    {formatTime(timeLeft)}
                  </span>
                  <span className={`text-xs font-bold uppercase tracking-[0.2em] mt-2 ${getModeColor().split(' ')[0]}`}>
                    {mode.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-6">
                <button
                  onClick={resetTimer}
                  className="p-5 rounded-3xl bg-gray-50 text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-all active:scale-90"
                  title={t('pomodoro.reset')}
                >
                  <RotateCcw className="w-7 h-7" />
                </button>
                
                <button
                  onClick={toggleTimer}
                  className={`w-48 py-5 rounded-[24px] font-black text-xl shadow-xl shadow-blue-200 transform transition-all hover:translate-y-[-2px] active:scale-95 flex items-center justify-center gap-3 ${
                    isActive 
                      ? 'bg-amber-100 text-amber-700' 
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isActive ? (
                    <>
                      <Pause className="w-6 h-6 fill-current" />
                      {t('pomodoro.pause')}
                    </>
                  ) : (
                    <>
                      <Play className="w-6 h-6 fill-current" />
                      {t('pomodoro.start')}
                    </>
                  )}
                </button>
                
                <div className="w-16 h-16 hidden md:block" /> {/* Spacer for balance */}
              </div>
            </div>
            
            <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/50 border border-blue-100 rounded-3xl p-6 flex items-start gap-4">
                <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-sm">Focus Tip</h4>
                  <p className="text-xs text-blue-800/80 mt-1 leading-relaxed">
                    Try visualizing the 3D model of the system you&apos;re studying during your focus session.
                  </p>
                </div>
              </div>
              <div className="bg-green-50/50 border border-green-100 rounded-3xl p-6 flex items-start gap-4">
                <div className="bg-green-500 p-2.5 rounded-xl text-white shadow-lg shadow-green-200">
                  <Coffee className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-green-900 text-sm">Active Rest</h4>
                  <p className="text-xs text-green-800/80 mt-1 leading-relaxed">
                    Stand up and stretch during your break to keep your blood flowing and mind sharp.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className="w-full lg:w-80 space-y-6">
            <div className="bg-white rounded-[32px] shadow-xl border border-gray-100 p-8">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                  <Trophy className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{t('pomodoro.stats_today')}</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <p className="text-4xl font-black text-gray-900">{stats.today.sessions}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('pomodoro.sessions')}</p>
                </div>
                <div className="pt-6 border-t border-gray-50">
                  <p className="text-4xl font-black text-gray-900">{stats.today.minutes}</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{t('pomodoro.minutes')}</p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[32px] shadow-xl p-8 text-white">
              <div className="flex items-center gap-3 mb-6">
                <Clock className="w-5 h-5 opacity-80" />
                <h3 className="font-bold text-lg">Weekly Focus</h3>
              </div>
              
              <div className="mb-6">
                <div className="flex items-end justify-between mb-2">
                  <span className="text-3xl font-black">{stats.week.sessions}</span>
                  <span className="text-xs font-bold opacity-60 uppercase">Goal: 20</span>
                </div>
                <div className="w-full bg-white/20 h-3 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-white transition-all duration-1000" 
                    style={{ width: `${Math.min((stats.week.sessions / 20) * 100, 100)}%` }}
                  />
                </div>
              </div>
              
              <p className="text-xs opacity-70 leading-relaxed italic">
                &quot;Small daily improvements are the key to long-term results.&quot;
              </p>
            </div>
          </div>
          
        </div>
      </div>
    </ProtectedRoute>
  );
}
