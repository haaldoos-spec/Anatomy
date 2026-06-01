'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import AnatomyViewer from '@/components/AnatomyViewer';
import { useLanguage } from '@/context/LanguageContext';

export default function AtlasPage() {
  const { t } = useLanguage();

  return (
    <ProtectedRoute>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('atlas.title')}</h1>
          <p className="mt-2 text-gray-600">
            {t('atlas.description')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <AnatomyViewer />
          </div>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">System Filter</h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-700">
                  <input type="checkbox" defaultChecked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>Skeletal System</span>
                </label>
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-400 cursor-not-allowed">
                  <input type="checkbox" disabled className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>Muscular System (Coming soon)</span>
                </label>
                <label className="flex items-center space-x-3 text-sm font-medium text-gray-400 cursor-not-allowed">
                  <input type="checkbox" disabled className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span>Nervous System (Coming soon)</span>
                </label>
              </div>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
              <h4 className="font-bold text-blue-900 mb-2">Study Tip</h4>
              <p className="text-sm text-blue-800">
                Click on specific bones to see their names in both English and Swedish. Try to identify them before clicking!
              </p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
