'use client';

import { useState, useEffect } from 'react';
import { translateService } from '@/services/translateService';

// Component to monitor DeepL API usage for free tier management
export default function TranslationUsageMonitor({ className = '' }) {
  const [stats, setStats] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Update stats every 30 seconds
    const updateStats = () => {
      setStats(translateService.getCacheStats());
    };

    updateStats();
    const interval = setInterval(updateStats, 30000);

    return () => clearInterval(interval);
  }, []);

  if (!stats) return null;

  const freeApiLimit = 500000; // DeepL free tier limit (500K characters/month)
  const dailyLimit = Math.floor(freeApiLimit / 30); // Rough daily limit
  const usagePercentage = Math.min((stats.todayApiCalls / dailyLimit) * 100, 100);

  const getUsageColor = () => {
    if (usagePercentage < 50) return 'text-green-600 bg-green-100';
    if (usagePercentage < 80) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className={`fixed bottom-4 left-4 z-40 ${className}`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="mb-2 px-3 py-2 bg-gray-800 text-white rounded-lg text-xs hover:bg-gray-700 transition-colors shadow-lg"
        title="Translation Usage Monitor"
      >
        API: {stats.todayApiCalls}
      </button>

      {/* Usage Panel */}
      {isVisible && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 p-4 w-72 text-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900 dark:text-white">Translation Usage</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ×
            </button>
          </div>

          {/* Today's Usage */}
          <div className="space-y-2 mb-4">
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">API Calls Today:</span>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getUsageColor()}`}>
                {stats.todayApiCalls}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cache Hits:</span>
              <span className="text-green-600 font-medium">{stats.todayCacheHits}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600 dark:text-gray-400">Cache Hit Rate:</span>
              <span className="text-blue-600 font-medium">{stats.cacheHitRate}%</span>
            </div>
          </div>

          {/* Usage Bar */}
          <div className="mb-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600 dark:text-gray-400">Daily Progress</span>
              <span className="text-gray-600 dark:text-gray-400">{usagePercentage.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  usagePercentage < 50 ? 'bg-green-500' :
                  usagePercentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(usagePercentage, 100)}%` }}
              />
            </div>
          </div>

          {/* Cache Stats */}
          <div className="pt-3 border-t border-gray-200 dark:border-gray-600 space-y-1 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500">Cached Translations:</span>
              <span>{stats.translationCacheSize}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Common Words:</span>
              <span>{stats.commonWordsAvailable}</span>
            </div>
          </div>

          {/* Tips */}
          {usagePercentage > 70 && (
            <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-xs text-yellow-700 dark:text-yellow-300">
              💡 High usage today! Consider using shorter words or check if words are already in your vocabulary.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
