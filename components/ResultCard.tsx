import React, { useState } from 'react';

interface ResultCardProps {
  result: string;
  agency: string;
  action: string;
  isMock: boolean;
}

export default function ResultCard({ result, agency, action, isMock }: ResultCardProps) {
  const linkify = (text: string) => {
    const parts = text.split(/\n/);
    return parts.map((line, i) => {
      const tokens = line.split(/(\*\*.*?\*\*|https?:\/\/\S+|www\.\S+)/g);
      return (
        <p key={i} className="mb-2 min-h-[1.2em]">
          {tokens.map((t, j) => {
            if (t.match(/^(https?:\/\/|www\.)/)) {
              const href = t.startsWith('www.') ? `https://${t}` : t;
              return (
                <a key={j} href={href} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline break-all">
                  {t}
                </a>
              );
            } else if (t.startsWith('**') && t.endsWith('**')) {
              return (
                <strong key={j} className="font-bold text-gray-900 dark:text-white">
                  {t.slice(2, -2)}
                </strong>
              );
            }
            return <span key={j}>{t}</span>;
          })}
        </p>
      );
    });
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(result);
      alert("Guide copied to clipboard");
    } catch {
      alert("Copy failed. Please copy manually.");
    }
  };

  const downloadText = () => {
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `philgov-guide-${agency}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full animate-in fade-in zoom-in duration-500">
      <label className="block mb-2 text-sm font-bold text-gray-900 dark:text-white">
        Your Simple Guide
      </label>
      <div className="relative h-full flex flex-col">
        {result && (
          <div className="flex flex-wrap justify-end gap-2 mb-2">
            <button
              onClick={() => window.open(`https://www.google.com/search?q=${encodeURIComponent(`${agency} ${action} requirements Philippines ${new Date().getFullYear()}`)}`, '_blank')}
              className="text-xs font-medium bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 py-1.5 px-3 rounded-lg shadow-sm dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
              Verify Info
            </button>
            <button
              onClick={copyToClipboard}
              className="text-xs font-medium bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 py-1.5 px-3 rounded-lg shadow-sm dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"/></svg>
              Copy
            </button>
            <button
              onClick={downloadText}
              className="text-xs font-medium bg-white hover:bg-violet-50 text-violet-700 border border-violet-200 py-1.5 px-3 rounded-lg shadow-sm dark:bg-gray-700 dark:text-violet-300 dark:border-gray-600 dark:hover:bg-gray-600 transition-all flex items-center gap-1"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/></svg>
              Download
            </button>
          </div>
        )}
        <div className="p-6 w-full text-sm text-gray-800 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-300 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 min-h-[500px] whitespace-pre-wrap leading-relaxed shadow-inner">
          {result ? linkify(result) : (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-3">
               <svg className="w-12 h-12 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/><path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg>
               <span>Your checklist and office location info will appear here...</span>
            </div>
          )}
        </div>
      </div>
      {isMock && (
         <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
           * Running in Demo Mode. Add your API Key to .env.local for real AI.
         </p>
      )}
    </div>
  );
}
