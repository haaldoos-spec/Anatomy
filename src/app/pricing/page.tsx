'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from '@/context/AuthContext';
import { Check, Zap, Star, Shield } from 'lucide-react';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';

const PLANS = [
  {
    id: 'free',
    nameKey: 'pricing.free',
    price: '$0',
    features: [
      'pricing.feature_basic_anatomy',
      'pricing.feature_limited_quizzes',
    ],
    buttonKey: 'pricing.current_plan',
    accent: 'gray',
  },
  {
    id: 'monthly',
    nameKey: 'pricing.monthly',
    price: '$9.99',
    interval: '/mo',
    features: [
      'pricing.feature_all_anatomy',
      'pricing.feature_unlimited_quizzes',
      'pricing.feature_ai_tutor',
      'pricing.feature_progression',
    ],
    buttonKey: 'pricing.subscribe',
    accent: 'blue',
    popular: true,
  },
  {
    id: 'annual',
    nameKey: 'pricing.annual',
    price: '$59.99',
    interval: '/yr',
    features: [
      'pricing.feature_all_anatomy',
      'pricing.feature_unlimited_quizzes',
      'pricing.feature_ai_tutor',
      'pricing.feature_progression',
    ],
    buttonKey: 'pricing.subscribe',
    accent: 'indigo',
    badge: 'pricing.save_money',
  },
];

export default function PricingPage() {
  const { t } = useLanguage();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);

  useEffect(() => {
    if (user) {
      api.get('/subscriptions/status')
        .then(res => setSubscriptionStatus(res.data))
        .catch(err => console.error('Failed to fetch sub status', err));
    }
  }, [user]);

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      router.push('/login?redirect=/pricing');
      return;
    }

    if (planId === 'free') return;

    setLoading(true);
    try {
      const response = await api.post('/subscriptions/create-checkout', { plan: planId });
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Checkout failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManage = async () => {
    try {
      const response = await api.get('/subscriptions/portal');
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      console.error('Portal failed', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-4 tracking-tight">
            {t('pricing.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('pricing.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PLANS.map((plan) => {
            const isCurrent = subscriptionStatus?.plan === plan.id || (!subscriptionStatus?.plan && plan.id === 'free');
            
            return (
              <div 
                key={plan.id}
                className={`bg-white rounded-[40px] p-8 shadow-xl border-2 transition-all hover:scale-[1.02] flex flex-col ${
                  plan.popular ? 'border-blue-500 ring-4 ring-blue-50' : 'border-gray-100'
                }`}
              >
                {plan.popular && (
                  <div className="bg-blue-600 text-white text-xs font-black uppercase tracking-widest py-1 px-4 rounded-full w-fit mb-6">
                    {t('pricing.most_popular')}
                  </div>
                )}
                {plan.badge && (
                  <div className="bg-indigo-600 text-white text-xs font-black uppercase tracking-widest py-1 px-4 rounded-full w-fit mb-6">
                    {t(plan.badge)}
                  </div>
                )}

                <h3 className="text-2xl font-black text-gray-900 mb-2">{t(plan.nameKey)}</h3>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-gray-900">{plan.price}</span>
                  {plan.interval && <span className="text-gray-500 font-bold">{plan.interval}</span>}
                </div>

                <ul className="space-y-4 mb-10 flex-grow">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className={`mt-1 p-0.5 rounded-full ${plan.accent === 'blue' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                        <Check className="w-4 h-4" />
                      </div>
                      <span className="text-gray-600 text-sm font-medium">{t(feature)}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => isCurrent && plan.id !== 'free' ? handleManage() : handleSubscribe(plan.id)}
                  disabled={loading || (isCurrent && plan.id === 'free')}
                  className={`w-full py-4 rounded-2xl font-black transition-all active:scale-95 flex items-center justify-center gap-2 ${
                    isCurrent 
                      ? 'bg-gray-100 text-gray-500 cursor-default' 
                      : plan.accent === 'blue'
                        ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200'
                        : plan.accent === 'indigo'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200'
                          : 'bg-white border-2 border-gray-200 text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {isCurrent && plan.id !== 'free' ? (
                    <>
                      <Shield className="w-5 h-5" />
                      {t('pricing.manage_subscription')}
                    </>
                  ) : (
                    <>
                      {plan.accent === 'blue' && <Zap className="w-5 h-5 fill-current" />}
                      {plan.accent === 'indigo' && <Star className="w-5 h-5 fill-current" />}
                      {t(isCurrent ? 'pricing.current_plan' : plan.buttonKey)}
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        <div className="mt-20 bg-blue-600 rounded-[40px] p-10 text-white text-center shadow-2xl">
          <h2 className="text-3xl font-black mb-4">Institutional Licensing</h2>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto font-medium">
            Are you a teacher or representative of a medical school? We offer bulk licensing for universities and study groups.
          </p>
          <button className="bg-white text-blue-600 px-10 py-4 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95">
            Contact Sales
          </button>
        </div>
      </div>
    </div>
  );
}
