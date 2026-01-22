"use client";

import { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { PRESETS, LOADING_MESSAGES } from '@/lib/constants';
import LocationPicker from './LocationPicker';
import ResultCard from './ResultCard';
import RecentSearches from './RecentSearches';
import LoadingSkeleton from './LoadingSkeleton';
import { Image as ImageIcon, X, Share2, Mic } from 'lucide-react';

type GenerateResponse = {
  result?: string;
  error?: string;
};

export default function Generator() {
  const [agency, setAgency] = useState('DFA (Passport)');
  const [action, setAction] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState('');
  const [followUps] = useState<string[]>([]);
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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Image size too large (max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = async () => {
    const trimmedAction = action.trim();
    if (!trimmedAction) {
      setError("Please tell us what you need to do (e.g. \"Renew passport\").");
      return;
    }

    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions before generating a guide.");
      return;
    }

    const payload = {
      agency,
      action: trimmedAction,
      location,
      image,
    };

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
        body: JSON.stringify(payload),
      });
      
      let data: GenerateResponse | null = null;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse JSON from /api/generate', e);
      }

      if (!response.ok) {
        const message = data?.error || `Server error (status ${response.status})`;
        setError(message);
        return;
      }

      if (data?.error) {
        setError(data.error);
        return;
      }

      setResult(data.result);
      
      // Parse follow-ups if present
      const followUpMatch = data.result.match(/<<<FOLLOWUPS>>>([\s\S]*?)<<<END_FOLLOWUPS>>>/);
      if (followUpMatch) {
        const rawFollowUps = followUpMatch[1].trim().split('\n').filter(q => q.trim().length > 0);
        setFollowUps(rawFollowUps);
        // Remove the follow-up block from the displayed result
        setResult(data.result.replace(/<<<FOLLOWUPS>>>[\s\S]*?<<<END_FOLLOWUPS>>>/, '').trim());
      } else {
        setFollowUps([]);
      }

      addToRecent(agency, trimmedAction);
      setIsMock(typeof data.result === 'string' && data.result.startsWith('[MOCK MODE'));
    } catch (error) {
      console.error('Error generating content:', error);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="generator" className="bg-transparent dark:bg-transparent py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
      <div className="max-w-screen-md mx-auto text-center mb-8 relative">
        <div className="absolute top-0 right-0 hidden md:block">
           <ThemeToggle />
        </div>
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
          <div className="flex flex-wrap gap-2 mb-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
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
            <button
              onClick={handleShare}
              className="text-xs flex items-center gap-1 text-violet-600 hover:text-violet-800 font-medium px-2 py-1 rounded-lg hover:bg-violet-50 transition-colors"
              title="Share this search"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">Share Link</span>
            </button>
          </div>

          <RecentSearches 
            searches={recentSearches} 
            onSelect={(a, act) => { setAgency(a); setAction(act); }} 
          />

          <div>
            <label htmlFor="agency-select" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Select Agency
            </label>
            <div className="flex gap-2">
            <div className="relative flex-1">
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
            <div className="w-1/3">
               <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
               >
                 <option value="taglish">Taglish 🇵🇭</option>
                 <option value="english">English 🇺🇸</option>
                 <option value="tagalog">Tagalog (Pure)</option>
                 <option value="cebuano">Cebuano (Bisaya)</option>
               </select>
            </div>
            </div>
          </div>

          <div>
            <label htmlFor="action-input" className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              What do you need to do?
            </label>
            <div className="relative">
              <input
                id="action-input"
                type="text"
                value={action}
                onChange={(e) => setAction(e.target.value)}
                className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-violet-500 focus:border-violet-500 block w-full p-3 pr-12 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white transition-shadow"
                placeholder="e.g. Renew passport, Apply for TIN, Lost ID"
              />
              <button
                onClick={handleVoiceInput}
                className={`absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full transition-all ${
                  isListening 
                    ? 'bg-red-100 text-red-600 animate-pulse' 
                    : 'text-gray-400 hover:text-violet-600 hover:bg-gray-100'
                }`}
                title="Speak to type"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-bold text-gray-700 dark:text-white">
              Upload Document/Form (Optional)
            </label>
            <div className="flex items-center gap-4">
               {!image ? (
                <label className="flex items-center gap-2 cursor-pointer px-4 py-2 border border-dashed border-gray-300 rounded-xl hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700 transition-colors">
                  <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">Choose Image</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
               ) : (
                <div className="relative group">
                  <Image
                    src={image}
                    alt="Uploaded"
                    width={64}
                    height={64}
                    className="h-16 w-16 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                  />
                  <button 
                    onClick={() => setImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5 shadow-md hover:bg-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
               )}
               {image && <span className="text-xs text-green-600 dark:text-green-400 font-medium">Image attached</span>}
            </div>
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
            disabled={loading || !action.trim()}
            className={`w-full relative text-white bg-violet-600 hover:bg-violet-700 focus:ring-4 focus:ring-violet-300 font-bold rounded-xl text-base px-5 py-3.5 mr-2 mb-2 dark:bg-violet-600 dark:hover:bg-violet-700 focus:outline-none dark:focus:ring-violet-800 shadow-lg hover:shadow-xl transition-all overflow-hidden ${
              (loading || !action.trim()) ? 'opacity-90 cursor-wait' : ''
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
              <div className="space-y-6">
                <ResultCard 
                  result={result} 
                  agency={agency} 
                  action={action} 
                  isMock={isMock} 
                />
                
                {followUps.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-violet-100 dark:border-gray-700">
                     <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                       <span className="bg-violet-100 text-violet-700 p-1 rounded-lg">❓</span> 
                       You might also ask...
                     </h3>
                     <div className="flex flex-wrap gap-3">
                       {followUps.map((q, idx) => (
                         <button
                           key={idx}
                           onClick={() => { setAction(q); handleGenerate(); }}
                           className="text-left text-sm px-4 py-3 rounded-xl bg-gray-50 hover:bg-violet-50 text-gray-700 hover:text-violet-700 border border-gray-200 hover:border-violet-200 transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600"
                         >
                           {q}
                         </button>
                       ))}
                     </div>
                  </div>
               )}
             </div>
           )}
        </div>
      </div>
    </section>
  );
}
