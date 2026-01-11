"use client";

import { useEffect, useState, useRef } from 'react';
import { PRESETS, LOADING_MESSAGES } from '@/lib/constants';
import LocationPicker from './LocationPicker';
import ResultCard from './ResultCard';
import RecentSearches from './RecentSearches';
import LoadingSkeleton from './LoadingSkeleton';

export default function Generator() {
  const [agency, setAgency] = useState('DFA (Passport)');
  const [action, setAction] = useState('');
  const [location, setLocation] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMock, setIsMock] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [detectionMethod, setDetectionMethod] = useState<null | 'gps' | 'ip' | 'manual' | 'map'>(null);
  const [recentSearches, setRecentSearches] = useState<Array<{ agency: string, action: string, date: number }>>([]);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 2000);
    } else {
      setLoadingMsgIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse recent searches", e);
      }
    }
  }, []);

  const addToRecent = (newAgency: string, newAction: string) => {
    const newItem = { agency: newAgency, action: newAction, date: Date.now() };
    setRecentSearches(prev => {
      const filtered = prev.filter(item => !(item.agency === newAgency && item.action === newAction));
      const updated = [newItem, ...filtered].slice(0, 5);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const storedTerms = typeof window !== 'undefined' ? window.localStorage.getItem('termsAccepted') : null;
    if (storedTerms === 'true') setTermsAccepted(true);
  }, []);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('termsAccepted', String(termsAccepted));
    }
  }, [termsAccepted]);

  const handleGenerate = async () => {
    setLoading(true);
    setResult("");
    setError(null);
    setIsMock(false);
    
    // Auto-scroll to result area start
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ agency, action, location }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        setResult(data.result);
        addToRecent(agency, action);
        setIsMock(typeof data.result === 'string' && data.result.startsWith('[MOCK MODE'));
      }
    } catch (error) {
      console.error('Error generating content:', error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="generator" className="bg-transparent dark:bg-transparent py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="max-w-screen-md mx-auto text-center mb-8">
        <h2 className="mb-4 text-5xl md:text-6xl tracking-tight font-extrabold font-display text-gray-900 dark:text-white">
          JuanGuide
        </h2>
        <p className="mb-4 font-light text-gray-500 sm:text-xl dark:text-gray-400">
          Select a service or ask a question to get your instant guide.
        </p>
      </div>

      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Input Section */}
        <div className="w-full space-y-5 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-xl border border-violet-100 dark:border-gray-700">
          <div className="flex flex-wrap gap-2 mb-2">
            {PRESETS.map((p) => (
              <button
                key={p.label}
                onClick={() => { setAgency(p.agency); setAction(p.action); }}
                className="text-xs md:text-sm px-3 py-1.5 rounded-full border border-gray-200 text-gray-600 hover:bg-violet-50 hover:text-violet-700 hover:border-violet-200 transition-colors dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
              >
                {p.label}
              </button>
            ))}
          </div>

          <RecentSearches 
            searches={recentSearches} 
            onSelect={(a, act) => { setAgency(a); setAction(act); }} 
          />

          <div>
            <label htmlFor="agency-select" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Select Agency
            </label>
            <div className="relative">
              <select
                id="agency-select"
                value={agency}
                onChange={(e) => setAgency(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
              >
                <option value="DFA (Passport)">DFA (Passport)</option>
                <option value="LTO (Driver’s License/Car)">LTO (Driver’s License)</option>
                <option value="BIR (TIN/Tax)">BIR (Tax/TIN)</option>
                <option value="PSA (Birth Cert)">PSA (Birth Certificate)</option>
                <option value="PSA (National ID)">PSA (National ID)</option>
                <option value="SSS">SSS</option>
                <option value="PhilHealth">PhilHealth</option>
                <option value="PAG-IBIG">PAG-IBIG</option>
                <option value="NBI (Clearance)">NBI Clearance</option>
                <option value="PhilPost">PhilPost</option>
                <option value="COMELEC">COMELEC</option>
                <option value="PNP">PNP</option>
                <option value="PRC">PRC</option>
                <option value="DSWD">DSWD</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="action-input" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              What do you need to do?
            </label>
            <input
              id="action-input"
              type="text"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
              placeholder="e.g. Renew passport, Apply for TIN, Lost ID"
            />
          </div>

          <LocationPicker
            location={location}
            setLocation={setLocation}
            detectionMethod={detectionMethod}
            setDetectionMethod={setDetectionMethod}
            setError={setError}
            termsAccepted={termsAccepted}
            setTermsAccepted={setTermsAccepted}
            agency={agency}
          />

          <button
            onClick={handleGenerate}
            disabled={loading || !action}
            className={`w-full relative text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 font-bold rounded-xl text-base px-5 py-3.5 mr-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 focus:outline-none dark:focus:ring-violet-800 shadow-lg hover:shadow-xl transition-all overflow-hidden ${
              (loading || !action) ? 'opacity-90 cursor-wait' : ''
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="animate-pulse">{LOADING_MESSAGES[loadingMsgIndex]}</span>
              </div>
            ) : (
              'Get My Guide'
            )}
          </button>
          
          {error && (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-xl bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
              {error}
            </div>
          )}
        </div>

        {/* Output Section */}
        <div ref={resultRef} className="scroll-mt-24 transition-all duration-500 ease-in-out">
           {loading ? (
             <LoadingSkeleton />
           ) : (
             <ResultCard 
               result={result} 
               agency={agency} 
               action={action} 
               isMock={isMock} 
             />
           )}
        </div>
      </div>
    </section>
  );
}
