'use client';

import Link from 'next/link';
import { BookOpen, MessageSquare, Timer, Trophy, Layers, Globe } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const features = [
    {
      name: t('landing.feature_3d'),
      description: t('landing.feature_3d_desc'),
      icon: Layers,
    },
    {
      name: t('landing.feature_quiz'),
      description: t('landing.feature_quiz_desc'),
      icon: BookOpen,
    },
    {
      name: t('landing.feature_ai'),
      description: t('landing.feature_ai_desc'),
      icon: MessageSquare,
    },
    {
      name: t('landing.feature_pomo'),
      description: t('landing.feature_pomo_desc'),
      icon: Timer,
    },
    {
      name: t('landing.feature_gamified'),
      description: t('landing.feature_gamified_desc'),
      icon: Trophy,
    },
    {
      name: t('landing.feature_bilingual'),
      description: t('landing.feature_bilingual_desc'),
      icon: Globe,
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              {t('landing.hero_title')}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t('landing.hero_subtitle')}
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/signup"
                className="rounded-md bg-blue-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
              >
                {t('landing.get_started')}
              </Link>
              <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900">
                {t('landing.live_demo')} <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Feature section */}
      <div className="mx-auto max-w-7xl px-6 lg:px-8 pb-24">
        <div className="mx-auto max-w-2xl lg:text-center">
          <h2 className="text-base font-semibold leading-7 text-blue-600">{t('landing.study_smarter')}</h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            {t('landing.features_title')}
          </p>
        </div>
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
            {features.map((feature) => (
              <div key={feature.name} className="relative pl-16">
                <dt className="text-base font-semibold leading-7 text-gray-900">
                  <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                    <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  {feature.name}
                </dt>
                <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
