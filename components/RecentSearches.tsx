import React from 'react';

interface RecentSearchesProps {
  searches: Array<{ agency: string; action: string; date: number }>;
  onSelect: (agency: string, action: string) => void;
}

export default function RecentSearches({ searches, onSelect }: RecentSearchesProps) {
  if (searches.length === 0) return null;

  return (
    <div className="mb-4">
      <p className="text-xs font-bold text-gray-400 dark:text-gray-500 mb-2 uppercase tracking-wide">Recent</p>
      <div className="flex flex-wrap gap-2">
        {searches.map((item, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(item.agency, item.action)}
            className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100 transition-colors dark:bg-gray-700 dark:text-emerald-300 dark:border-gray-600"
          >
            <svg className="w-3 h-3 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span className="truncate max-w-[200px]">{item.action} <span className="opacity-50">({item.agency})</span></span>
          </button>
        ))}
      </div>
    </div>
  );
}
