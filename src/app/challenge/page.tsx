'use client';

import React, { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { useSocket } from '@/hooks/useSocket';
import api from '@/lib/api';
import { Swords, Trophy, History, Search, Check, X, User } from 'lucide-react';
import ChallengeQuiz from '@/components/challenge/ChallengeQuiz';

export default function ChallengePage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const socket = useSocket();

  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [history, setHistory] = useState<any[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchError, setSearchError] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  
  const [incomingChallenge, setIncomingChallenge] = useState<any>(null);
  const [activeChallenge, setActiveChallenge] = useState<any>(null);
  const [challengeResult, setChallengeResult] = useState<any>(null);
  const [gameState, setGameState] = useState<'lobby' | 'playing' | 'waiting_opponent' | 'result'>('lobby');
  
  const [questions, setQuestions] = useState<any[]>([]);
  const [opponentScore, setOpponentScore] = useState(0);

  useEffect(() => {
    fetchData();

    socket.on('challenge:received', (data: any) => {
      setIncomingChallenge(data);
    });

    socket.on('challenge:accepted', (data: any) => {
      // Challenger sees this when opponent accepts
    });

    socket.on('challenge:start', (data: any) => {
      setQuestions(data.questions);
      setActiveChallenge(data.challengeId);
      setGameState('playing');
      setIncomingChallenge(null);
      setChallengeResult(null);
      setOpponentScore(0);
    });

    socket.on('challenge:opponent_score', (data: any) => {
      if (data.challengeId === activeChallenge) {
        setOpponentScore(data.opponentScore);
      }
    });

    socket.on('challenge:result', (data: any) => {
      setChallengeResult(data);
      setGameState('result');
    });

    socket.on('challenge:error', (data: any) => {
      setSearchError(data.message);
      setSearchLoading(false);
    });

    socket.on('challenge:sent', () => {
      setSearchLoading(false);
      setSearchEmail('');
      // Show some feedback that it's sent
    });

    return () => {
      socket.off('challenge:received');
      socket.off('challenge:accepted');
      socket.off('challenge:start');
      socket.off('challenge:opponent_score');
      socket.off('challenge:result');
      socket.off('challenge:error');
      socket.off('challenge:sent');
    };
  }, [socket, activeChallenge]);

  const fetchData = async () => {
    try {
      const lbRes = await api.get('/challenge/leaderboard');
      setLeaderboard(lbRes.data);
      const histRes = await api.get('/challenge/history');
      setHistory(histRes.data);
    } catch (err) {
      console.error('Failed to fetch challenge data', err);
    }
  };

  const handleSendChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchEmail) return;
    setSearchLoading(true);
    setSearchError('');
    socket.emit('challenge:send', { challengedEmail: searchEmail });
  };

  const handleAccept = () => {
    if (incomingChallenge) {
      socket.emit('challenge:accept', { challengeId: incomingChallenge.challengeId });
    }
  };

  const handleDecline = () => {
    if (incomingChallenge) {
      socket.emit('challenge:decline', { challengeId: incomingChallenge.challengeId });
      setIncomingChallenge(null);
    }
  };

  const handleQuizFinish = (finalScore: number) => {
    setGameState('waiting_opponent');
    socket.emit('challenge:finish', { challengeId: activeChallenge, score: finalScore });
  };

  const handleQuizProgress = (currentScore: number) => {
    socket.emit('challenge:answer', { challengeId: activeChallenge, score: currentScore });
  };

  if (gameState === 'playing' || gameState === 'waiting_opponent' || gameState === 'result') {
    return (
      <ProtectedRoute>
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="bg-white rounded-[40px] shadow-2xl p-8 border border-gray-100">
            {gameState === 'playing' && (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {user?.name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('nav.hi')}</p>
                      <p className="font-bold text-gray-900">{user?.name}</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-black">
                      VS
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-right">
                    <div>
                      <p className="text-xs font-black text-gray-400 uppercase tracking-widest">{t('challenge.opponent_score')}</p>
                      <p className="font-bold text-blue-600 text-xl">{opponentScore}</p>
                    </div>
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                      ?
                    </div>
                  </div>
                </div>

                {/* Here we would render a modified Quiz component */}
                <ChallengeQuiz 
                  questions={questions}
                  onFinish={handleQuizFinish}
                  onProgress={handleQuizProgress}
                />
              </div>
            )}

            {gameState === 'waiting_opponent' && (
              <div className="text-center py-20">
                <div className="w-20 h-20 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
                <h2 className="text-2xl font-black text-gray-900 mb-2">{t('challenge.waiting_for_opponent')}</h2>
                <p className="text-gray-500 font-medium">You finished with score: {challengeResult?.challengerScore || challengeResult?.challengedScore || '...'}</p>
              </div>
            )}

            {gameState === 'result' && (
              <div className="text-center py-10">
                <div className="mb-8">
                  {challengeResult.winnerId === user?.id ? (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-yellow-100">
                        <Trophy className="w-12 h-12" />
                      </div>
                      <h2 className="text-4xl font-black text-gray-900">{t('challenge.winner')}</h2>
                    </div>
                  ) : challengeResult.winnerId === null ? (
                    <h2 className="text-4xl font-black text-gray-900">{t('challenge.draw')}</h2>
                  ) : (
                    <div className="space-y-4">
                      <div className="w-24 h-24 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto">
                        <X className="w-12 h-12" />
                      </div>
                      <h2 className="text-4xl font-black text-gray-900">{t('challenge.loser')}</h2>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-10">
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('nav.hi')}</p>
                    <p className="text-3xl font-black text-gray-900">{challengeResult.challengerScore}</p>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-3xl border border-gray-100">
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">{t('challenge.opponent_score')}</p>
                    <p className="text-3xl font-black text-gray-900">{challengeResult.challengedScore}</p>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setGameState('lobby');
                    fetchData();
                  }}
                  className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  {t('quiz.back_to_dashboard')}
                </button>
              </div>
            )}
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 pb-12">
        <Navbar />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex flex-col md:flex-row gap-8">
            
            {/* Main Action Area */}
            <div className="flex-grow space-y-8">
              <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-blue-100 p-3 rounded-2xl text-blue-600">
                    <Swords className="w-6 h-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">{t('challenge.challenge_friend')}</h1>
                    <p className="text-gray-500 font-medium">Battle in real-time anatomy quizzes.</p>
                  </div>
                </div>

                <form onSubmit={handleSendChallenge} className="flex gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                      type="email"
                      placeholder={t('challenge.enter_email')}
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:outline-none font-medium transition-all"
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={searchLoading}
                    className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all disabled:opacity-50"
                  >
                    {searchLoading ? '...' : t('challenge.send_challenge')}
                  </button>
                </form>
                {searchError && <p className="text-red-500 text-sm font-bold mt-2">{searchError}</p>}
              </div>

              {/* Incoming Challenge Alert */}
              {incomingChallenge && (
                <div className="bg-indigo-600 rounded-[40px] p-8 text-white shadow-2xl animate-bounce-short">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                      <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center">
                        <Swords className="w-8 h-8" />
                      </div>
                      <div>
                        <h2 className="text-xl font-black uppercase tracking-wider">{t('challenge.incoming_challenge')}</h2>
                        <p className="text-indigo-100 font-medium">{incomingChallenge.challengerName} wants to battle!</p>
                      </div>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <button 
                        onClick={handleAccept}
                        className="flex-grow sm:flex-grow-0 px-8 py-3 bg-white text-indigo-600 rounded-xl font-black hover:bg-indigo-50 transition-all"
                      >
                        {t('challenge.accept')}
                      </button>
                      <button 
                        onClick={handleDecline}
                        className="flex-grow sm:flex-grow-0 px-8 py-3 bg-indigo-500 text-white rounded-xl font-black hover:bg-indigo-400 transition-all"
                      >
                        {t('challenge.decline')}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* History */}
              <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-gray-100 p-3 rounded-2xl text-gray-600">
                    <History className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-black text-gray-900 tracking-tight">{t('challenge.history')}</h2>
                </div>
                
                <div className="space-y-4">
                  {history.length === 0 ? (
                    <p className="text-gray-400 font-medium italic">No recent challenges.</p>
                  ) : (
                    history.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                             <User className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-bold text-gray-900">
                               {item.challenger_id === user?.id ? item.challenged_name : item.challenger_name}
                             </p>
                             <p className="text-xs text-gray-400 font-bold uppercase">{new Date(item.created_at).toLocaleDateString()}</p>
                           </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                             <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Score</p>
                             <p className="font-black text-gray-900">{item.challenger_score} - {item.challenged_score}</p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            item.winner_id === user?.id ? 'bg-green-100 text-green-600' : 
                            item.winner_id === null ? 'bg-gray-200 text-gray-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {item.winner_id === user?.id ? 'Won' : item.winner_id === null ? 'Draw' : 'Lost'}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar / Leaderboard */}
            <div className="w-full md:w-80 shrink-0">
              <div className="bg-white rounded-[40px] shadow-xl p-8 border border-gray-100 sticky top-8">
                <div className="flex items-center gap-4 mb-8">
                  <div className="bg-yellow-100 p-3 rounded-2xl text-yellow-600">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">{t('challenge.leaderboard')}</h2>
                </div>

                <div className="space-y-6">
                  {leaderboard.map((player, index) => (
                    <div key={player.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className={`w-6 text-sm font-black ${index < 3 ? 'text-yellow-600' : 'text-gray-400'}`}>
                          #{index + 1}
                        </span>
                        <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                          {player.full_name[0]}
                        </div>
                        <span className="font-bold text-gray-700 text-sm truncate max-w-[100px]">{player.full_name}</span>
                      </div>
                      <span className="font-black text-blue-600 text-sm">{player.wins} W</span>
                    </div>
                  ))}
                  {leaderboard.length === 0 && <p className="text-gray-400 text-sm italic">No data yet.</p>}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
